import { Prisma, Gym } from "@prisma/client";
import { FindManyNearbyParams, GymRepository } from "../gym-repository";
import { prisma } from "@/lib/prisma";

export class PrismaGymRepository implements GymRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data
    });

    return gym;
  }
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id
      }
    });

    return gym;
  }
  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        name: {
          contains: query
        }
      },
      take: 20,
      skip: (page - 1) * 20
    });

    return gyms;
  }
  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms;
  }

}