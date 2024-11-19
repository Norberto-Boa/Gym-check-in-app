import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { AuthenticationService } from "@/services/authentication.service";
import { InvalidCredentialsError } from "@/services/Errors/invalid-credentials-error";

export async function authetication(request: FastifyRequest, reply: FastifyReply) {
  const autheticationBodySchema = z.object({
    email: z.string(),
    password: z.string().min(8),
  });

  const { email, password } = autheticationBodySchema.parse(request.body);

  try {
    const userRepository = new PrismaUsersRepository();
    const authenticationService = new AuthenticationService(userRepository);
    await authenticationService.execute({ email, password });

  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err;
  }

  return reply.code(200).send();

}
