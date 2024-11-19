import { describe, it, expect } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { AuthenticationService } from "./authentication.service";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./Errors/invalid-credentials-error";

describe("Authenticate Service", () => {
  it("Should should be able to authenticate", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticationService(usersRepository);

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
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticationService(usersRepository);

    expect(() => sut.execute({
      email: "johndoe@example.com",
      password: "123456"
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  })

  it("should not be able to authenticate with an invalid password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticationService(usersRepository);

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
