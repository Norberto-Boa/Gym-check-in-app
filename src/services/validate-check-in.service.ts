import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymRepository } from '@/repositories/gym-repository';
import { CheckIn } from '@prisma/client';
import { ResourceNotFound } from './Errors/resource-not-found';
import { getDistanceBetweenCoordinates } from '../utils/get-distance-between-coordinates';
import { MaxNumberOfCheckInsError } from './Errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './Errors/max-distance-error';
import dayjs from 'dayjs';
import { LateCheckInValidationError } from './Errors/late-check-in-validation-error';

interface ValidateCheckInServiceRequest {
  checkInId: string;
}

interface ValidateCheckInServiceResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
  ) { }

  async execute({ checkInId }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFound();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(checkIn.created_at, 'minutes');

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}