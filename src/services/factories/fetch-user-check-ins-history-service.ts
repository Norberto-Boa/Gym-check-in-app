import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUserCheckInHistoryService } from '../fetch-user-check-ins-history.service';

export function makeFetchUserCheckInsService() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const service = new FetchUserCheckInHistoryService(checkInsRepository);

  return service
}