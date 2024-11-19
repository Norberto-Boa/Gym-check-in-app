import { describe, it, expect, beforeEach } from "vitest";
import { RegisterService } from "./register.service";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { UserAlreadyExistsError } from "./Errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe("Register Service", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterService(usersRepository);
	})

	it("Should hash user password upon registartion", async () => {


		const { user } = await sut.execute({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "password123",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("Should hash user password upon registartion", async () => {

		const { user } = await sut.execute({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "password123",
		});

		const isPasswordCorrectlyHashed = await compare(
			"password123",
			user.password,
		);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it("Should not be able to register with duplicate email", async () => {
		const email = "john.doe@example.com";

		await sut.execute({
			name: "John Doe",
			email,
			password: "password123",
		});

		await expect(() =>
			sut.execute({
				name: "John Doe",
				email,
				password: "password123",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
