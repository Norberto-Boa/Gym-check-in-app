import type { Gym, Prisma } from "@prisma/client";

export interface FindManyNearbyParams{
  latitude: number
  longitude: number
}

export interface GymRepository {

  // Create a new instance of Gym
  create(data: Prisma.GymCreateInput): Promise<Gym>;

  // Find User by Id
  findById(id: string): Promise<Gym | null>

  // Find Gym by Name
  searchMany(query: string, page: number): Promise<Gym[]>

  //Find which are close
  findManyNearby(params: FindManyNearbyParams):Promise<Gym[]>
}
