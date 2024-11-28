import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym-repository';
import { CreateGymService } from '../create-gym.service';

export function makeCreateGymService() {
  const gymRepository = new PrismaGymRepository();
  const service = new CreateGymService(gymRepository);

  return service
}