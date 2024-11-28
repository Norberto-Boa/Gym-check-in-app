import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { FetchNearbyGymsService } from "./fetch-nearby-gyms.service";

let GymRepository: InMemoryGymRepository;
let sut: FetchNearbyGymsService;

describe("Search Gym Service", () => {
  beforeEach(async () => {
    GymRepository = new InMemoryGymRepository();
    sut = new FetchNearbyGymsService(GymRepository);
  });

  it("Should be able to fetch nearby gyms", async () => {
    await GymRepository.create({
      name: "Near Gym",
      email: "JS@gym.com",
      phone: "123456789",
      latitude: -26.0430503,
      longitude: 32.4353989,
      description: null,
    });

    await GymRepository.create({
      name: "Far Gym",
      email: "JS@gym.com",
      phone: "123456789",
      latitude: -26.07783,
      longitude: 32.2690356,
      description: null,
    });

    const { gyms } = await sut.execute({
      userLatitude: -26.0430503,
      userLongitude: 32.3684028,
    });

    console.log(gyms)

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ name: "Near Gym" })]);
  });
});
