import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { CheckInService } from "./check-in.service";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./Errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./Errors/max-number-of-check-ins-error";
import { ValidateCheckInService } from "./validate-check-in.service";
import { ResourceNotFound } from "./Errors/resource-not-found";
import { LateCheckInValidationError } from "./Errors/late-check-in-validation-error";

let checkInsRepository: InMemoryCheckInsRepository;
// let gymRepository: InMemoryGymRepository;
let sut: ValidateCheckInService;

describe("Validate Check In Service", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    // gymRepository = new InMemoryGymRepository();
    sut = new ValidateCheckInService(checkInsRepository);

    // await gymRepository.create({
    //   id: 'gym-01',
    //   name: 'JS Gym',
    //   description: 'Hoola',
    //   latitude: -25.9029608,
    //   longitude: 32.4353989,
    //   phone: '',
    //   created_at: new Date(),
    //   email: "mail"
    // })

    vi.useFakeTimers();
  })

  afterEach(() => {
    vi.useRealTimers();
  })

  it("Should be able to validate the check-in", async () => {

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("Should not be able to validate an inexistent check-in", async () => {
    await expect(async () =>
      await sut.execute({
        checkInId: 'Inexsitent check-in'
      })
    ).rejects.toBeInstanceOf(ResourceNotFound);

  });

  it("Should not be able to validate the check-in after 20 minutes of creation", async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs);


    await expect(() => sut.execute({
      checkInId: createdCheckIn.id
    })).rejects.toBeInstanceOf(LateCheckInValidationError);

  })
});
