import { describe, it, expect, beforeEach } from "vitest";
import { AuthenticationService } from "./authentication.service";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./Errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticationService;

describe("Authenticate Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticationService(usersRepository);
  })

  it("Should should be able to authenticate", async () => {

    await usersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: await hash("password123", 6),
    })

    const { user } = await sut.execute({
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with an invalid email", () => {

    expect(async () => await sut.execute({
      email: "johndoe@example.com",
      password: "123456"
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  })

  it("should not be able to authenticate with an invalid password", async () => {

    await usersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: await hash("password123", 6),
    })


    expect(async () => await sut.execute({
      email: "johndoe@example.com",
      password: "123456"
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  })

});
