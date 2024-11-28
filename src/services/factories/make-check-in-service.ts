import { CheckInService } from '../check-in.service';
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym-repository';

export function makeCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymRepository = new PrismaGymRepository();
  const service = new CheckInService(checkInsRepository, gymRepository);

  return service
}