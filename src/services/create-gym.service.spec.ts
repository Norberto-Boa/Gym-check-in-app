import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { CreateGymService } from "./create-gym.service";

let inMemoryGymRepository: InMemoryGymRepository;
let sut: CreateGymService

describe("Create Gym Service", () => {
  beforeEach(() => {
    inMemoryGymRepository = new InMemoryGymRepository();
    sut = new CreateGymService(inMemoryGymRepository);
  })

  it("Should be able to create a gym", async () => {


    const { gym } = await sut.execute({
      name: "JS Gym",
      email: "JS@gym.com",
      phone: "123456789",
      latitude: -25.9029608,
      longitude: 32.4353989,
      description: null
    });

    expect(gym.id).toEqual(expect.any(String));
  });

});
