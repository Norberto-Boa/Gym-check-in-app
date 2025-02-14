import type { UsersRepository } from "@/repositories/users-repository";
import bcrypt from "bcryptjs";
import { UserAlreadyExistsError } from "./Errors/user-already-exists-error";
import type { User } from "@prisma/client";

interface RegisterServiceRequest {
	name: string;
	email: string;
	password: string;
}

interface RegisterServiceResponse {
	user: User;
}

export class RegisterService {
	constructor(private userRepository: UsersRepository) {}

	async execute({
		name,
		email,
		password,
	}: RegisterServiceRequest): Promise<RegisterServiceResponse> {
		const passwordHash = await bcrypt.hash(password, 6);

		const userWithSameEmail = await this.userRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}

		// const prismaUserRepository = new PrismaUsersRepository();

		const user = await this.userRepository.create({
			name,
			email,
			password: passwordHash,
		});

		return { user };
	}
}
