import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { RegisterService } from "@/services/register.service";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string(),
		password: z.string().min(8),
	});

	const { name, email, password } = registerBodySchema.parse(request.body);

	const userRepository = new PrismaUsersRepository();
	const registerService = new RegisterService(userRepository);
	const user = await registerService.execute({ name, email, password });

	return reply.code(201).send(user);
}
