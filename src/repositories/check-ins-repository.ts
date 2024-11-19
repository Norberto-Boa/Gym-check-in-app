import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
  // Create a new check-in
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}