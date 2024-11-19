import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymRepository } from '@/repositories/gym-repository';
import { CheckIn } from '@prisma/client';
import { ResourceNotFound } from './Errors/resource-not-found';
import { getDistanceBetweenCoordinates } from '../utils/get-distance-between-coordinates';

interface CheckInRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInResponse {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymRepository: GymRepository
  ) { }

  async execute({ userId, gymId, userLatitude, userLongitude }: CheckInRequest): Promise<CheckInResponse> {
    const gym = await this.gymRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFound();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude, },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    )

    const mAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > mAX_DISTANCE_IN_KILOMETERS) {
      throw new Error("Distance maximized")
    }

    // Calculate the distance between user and gym

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());


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