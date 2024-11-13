import { describe, it, expect } from "vitest";
import { RegisterService } from "./register.service";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { compare } from "bcryptjs";
import { randomUUID } from "node:crypto";

describe("Register Service", () => {
	it("Should hash user password upon registartion", async () => {
		const prismaUsersRepository = new PrismaUsersRepository();
		const registerService = new RegisterService({
			async findByEmail(email) {
				return null; // User does not exist in the database.
			},

			async create(data) {
				return {
					id: randomUUID(),
					name: data.name,
					email: data.email,
					password: data.password,
					created_at: new Date(),
					updated_at: new Date(),
				};
			},
		});

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
});
