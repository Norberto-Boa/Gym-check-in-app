import type { Gym } from "@prisma/client";
import { GymRepository } from "@/repositories/gym-repository";

interface SearchGymServiceRequest {
  query: string;
  page: number
}

interface SearchGymServiceResponse {
  gym: Gym[];
}

export class SearchGymService {
  constructor(private gymRepository: GymRepository) { }

  async execute({
    query,
    page
  }: SearchGymServiceRequest): Promise<SearchGymServiceResponse> {

    const gyms = await this.gymRepository.searchMany(query, page);

    return { gyms };
  }
}
