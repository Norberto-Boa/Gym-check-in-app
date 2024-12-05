import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeRegisterService } from "@/services/factories/make-register-service";

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string(),
		password: z.string().min(8),
	});

	const { name, email, password } = registerBodySchema.parse(request.body);

	const registerService = makeRegisterService();
	const user = await registerService.execute({ name, email, password });

	return reply.code(201).send(user);
}
