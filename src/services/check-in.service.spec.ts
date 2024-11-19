import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { CheckInService } from "./check-in.service";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./Errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./Errors/max-number-of-check-ins-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymRepository: InMemoryGymRepository;
let sut: CheckInService;

describe("Check In Service", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymRepository = new InMemoryGymRepository();
    sut = new CheckInService(checkInsRepository, gymRepository);

    await gymRepository.create({
      id: 'gym-01',
      name: 'JS Gym',
      description: 'Hoola',
      latitude: -25.9029608,
      longitude: 32.4353989,
      phone: '',
      created_at: new Date(),
      email: "mail"
    })

    vi.useFakeTimers();
  })

  afterEach(() => {
    vi.useRealTimers();
  })

  it("Should be able to check-in", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -25.9029608,
      userLongitude: 32.4353989
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check-in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))



    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -25.9029608,
      userLongitude: 32.4353989
    });

    await expect(() => sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -25.9029608,
      userLongitude: 32.4353989
    })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("Should able to check-in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))


    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -25.9029608,
      userLongitude: 32.4353989
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -25.9029608,
      userLongitude: 32.4353989
    })

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check-in if gym is distant", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    gymRepository.items.push({
      id: 'gym-02',
      name: 'JS Gym',
      description: 'Hoola',
      latitude: new Decimal(-25.9454174),
      longitude: new Decimal(32.4506768),
      phone: '',
      created_at: new Date(),
      email: "mail"
    })

    await expect(() => sut.execute({
      gymId: "gym-02",
      userId: "user-01",
      userLatitude: -25.9029608,
      userLongitude: 32.4353989
    })).rejects.toBeInstanceOf(MaxDistanceError);
  });

});
