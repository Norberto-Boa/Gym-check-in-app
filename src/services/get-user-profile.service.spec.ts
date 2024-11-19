import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { hash } from "bcryptjs";
import { GetUserProfileService } from "./get-user-profile.service";
import { ResourceNotFound } from "./Errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe("Authenticate Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(usersRepository);
  })

  it("Should should be able to authenticate", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: await hash("password123", 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual(createdUser.name);
  });

  it("should throw resource not found if user is invalid", () => {
    expect(async () => await sut.execute({
      userId: "non-existent-user"
    })).rejects.toBeInstanceOf(ResourceNotFound);
  })


});
