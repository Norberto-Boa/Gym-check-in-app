import { describe, it, expect, beforeEach } from "vitest";
import { CheckInService } from "./check-in.service";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInService;

describe("Check In Service", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInService(checkInsRepository);
  })

  it("Should should be able to create a check-in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01"
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

});
