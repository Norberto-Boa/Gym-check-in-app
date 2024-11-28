import { describe, it, expect, beforeEach } from "vitest";
import { FetchUserCheckInHistoryService } from "./fetch-user-check-ins-history.service";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { SearchGymService } from "./search-gyms.service";

let GymRepository: InMemoryGymRepository;
let sut: SearchGymService;

describe("Search Gym Service", () => {
  beforeEach(async () => {
    GymRepository = new InMemoryGymRepository();
    sut = new SearchGymService(GymRepository);
  });

  it("Should be able to fetch search for gyms", async () => {
    await GymRepository.create({
      name: "JS Gym",
      email: "JS@gym.com",
      phone: "123456789",
      latitude: -25.9029608,
      longitude: 32.4353989,
      description: null,
    });

    await GymRepository.create({
      name: "JAVAS Gym",
      email: "JS@gym.com",
      phone: "123456789",
      latitude: -25.9029608,
      longitude: 32.4353989,
      description: null,
    });

    const { gyms } = await sut.execute({
      query: "JS",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ name: "JS Gym" })]);
  });

  it("Should be able to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await GymRepository.create({
        name: "JAVAS Gym " + i,
        email: "JS@gym.com",
        phone: "123456789",
        latitude: -25.9029608,
        longitude: 32.4353989,
        description: null,
      });
    }

    const { gyms } = await sut.execute({
      query: "JAVA",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ name: "JAVAS Gym 21" }),
      expect.objectContaining({ name: "JAVAS Gym 22" }),
    ]);
  });
});
