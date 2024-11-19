import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { CheckIn } from '@prisma/client';

interface CheckInRequest {
  userId: string;
  gymId: string;
}

interface CheckInResponse {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
  ) { }

  async execute({ userId, gymId }: CheckInRequest): Promise<CheckInResponse> {

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

    console.log(checkInOnSameDay);

    if (checkInOnSameDay) {
      throw new Error("Already checked in today");
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId
    })

    return { checkIn };
  }
}