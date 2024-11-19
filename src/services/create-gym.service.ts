import type { Gym } from "@prisma/client";
import { GymRepository } from "@/repositories/gym-repository";

interface CreateGymServiceRequest {
  name: string;
  email: string;
  phone: string;
  latitude: number;
  longitude: number;
  description: string | null;
}

interface CreateGymServiceResponse {
  gym: Gym;
}

export class CreateGymService {
  constructor(private gymRepository: GymRepository) { }

  async execute({
    name,
    email,
    latitude,
    longitude,
    phone,
    description
  }: CreateGymServiceRequest): Promise<CreateGymServiceResponse> {

    const gym = await this.gymRepository.create({
      name,
      email,
      latitude,
      longitude,
      phone,
      description
    });

    return { gym };
  }
}
