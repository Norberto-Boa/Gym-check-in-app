import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym-repository';
import { FetchNearbyGymsService } from '../fetch-nearby-gyms.service';

export function makeFetchNearbyGymsService() {
  const gymRepository = new PrismaGymRepository();
  const service = new FetchNearbyGymsService(gymRepository);

  return service
}