import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
  // Find check in by ID
  findById(id: string): Promise<CheckIn | null>

  // Create a new check-in
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>

  // Find a check-in by its UserID on the Date
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>

  // Find the check-ins by the userID
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>

  // Count the number of check-ins of the User
  countByUserId(userId: string): Promise<number>

  // Update a check-in
  save(checkIn: CheckIn): Promise<CheckIn>
}