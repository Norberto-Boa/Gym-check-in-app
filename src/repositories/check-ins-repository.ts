import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
  // Create a new check-in
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>

  // Find a check-in by its UserID on the Date
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>

  //
}