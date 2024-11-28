import { Prisma, CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findById(id: string){
    const checkIn = this.items.find(item => item.id === id);

    if(!checkIn){
      return null;
    }

    return checkIn;
  }

  async save(checkIn: CheckIn){
    const checkInIndex = this.items.findIndex(item => item.id === checkIn.id);

    if(checkInIndex >= 0){
      this.items[checkInIndex] = checkIn
    }

    return checkIn;
  }


  async countByUserId(userId: string): Promise<number> {
    return this.items.filter(item => item.user_id === userId).length
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.items
      .filter(item => userId === item.user_id)
      .slice((page - 1) * 20, page * 20);

    return checkIns
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID().toString(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkIn = this.items.find(item => {
      const checkInDate = dayjs(item.created_at)
      const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return item.user_id === userId && isOnSameDate
    });

    if (!checkIn) {
      return null;
    }

    return checkIn
  }
}