import type { Prisma, User } from "@prisma/client";

export interface UsersRepository {
	//  Create a new user
	create(data: Prisma.UserCreateInput): Promise<User>;

	// Find user by email
	findByEmail(email: string): Promise<User | null>;
}
