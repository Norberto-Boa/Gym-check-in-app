import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { CheckInService } from "./check-in.service";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInService;

describe("Check In Service", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInService(checkInsRepository);

    vi.useFakeTimers();
  })

  afterEach(() => {
    vi.useRealTimers();
  })

  it("Should be able to check-in", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01"
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check-in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))


    await sut.execute({
      gymId: "gym-01",
      userId: "user-01"
    });

    await expect(() => sut.execute({
      gymId: "gym-01",
      userId: "user-01"
    })).rejects.toBeInstanceOf(Error);
  });

  it("Should able to check-in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))


    await sut.execute({
      gymId: "gym-01",
      userId: "user-01"
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01"
    })

    await expect(checkIn.id).toEqual(expect.any(String));
  });

});
