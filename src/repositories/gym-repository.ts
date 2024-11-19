import type { Gym } from "@prisma/client";

export interface GymRepository {

  // Find User by Id
  findById(id: string): Promise<Gym | null>
}
