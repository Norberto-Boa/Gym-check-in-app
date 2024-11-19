import type { Gym, Prisma } from "@prisma/client";

export interface GymRepository {

  // Create a new instance of Gym
  create(data: Prisma.GymCreateInput): Promise<Gym>;

  // Find User by Id
  findById(id: string): Promise<Gym | null>
}
