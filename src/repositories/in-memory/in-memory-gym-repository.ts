import { Gym, Prisma } from "@prisma/client";
import { GymRepository, type FindManyNearbyParams } from "../gym-repository";
import { randomUUID } from "crypto";
import { Decimal } from '@prisma/client/runtime/library';
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymRepository implements GymRepository {
  public items: Gym[] = [];

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter(item => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        { latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber() }
      )

      

      // console.log(distance);

      return distance < 10;
    })
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = this.items
      .filter(item => item.name.includes(query))
      .slice((page - 1) * 20, page * 20);

    return gyms;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID().toString(),
      name: data.name,
      email: data.email,
      longitude: new Decimal(data.longitude.toString()),
      latitude: new Decimal(data.latitude.toString()),
      phone: data.phone,
      description: data.description ?? null,
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }
}