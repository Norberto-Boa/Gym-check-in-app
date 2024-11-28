import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym-repository';
import { SearchGymService } from '../search-gyms.service';

export function makeSearchGymService() {
  const gymRepository = new PrismaGymRepository();
  const service = new SearchGymService(gymRepository);

  return service
}