import { describe, it, expect } from "vitest";
import { RegisterService } from "./register.service";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { UserAlreadyExistsError } from "./Errors/user-already-exists-error";

describe("Register Service", () => {
	it("Should hash user password upon registartion", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerService = new RegisterService(usersRepository);

		const { user } = await registerService.execute({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "password123",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("Should hash user password upon registartion", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerService = new RegisterService(usersRepository);

		const { user } = await registerService.execute({
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
		const usersRepository = new InMemoryUsersRepository();
		const registerService = new RegisterService(usersRepository);

		const email = "john.doe@example.com";

		await registerService.execute({
			name: "John Doe",
			email,
			password: "password123",
		});

		expect(() =>
			registerService.execute({
				name: "John Doe",
				email,
				password: "password123",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
