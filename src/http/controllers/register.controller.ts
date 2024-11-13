import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { RegisterService } from "@/services/register.service";
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const userRepository = new PrismaUsersRepository();
    const registerService = new RegisterService(userRepository)
    const user = await registerService.execute({ name, email, password });


    return reply.code(201).send(user);
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.code(409).send();
    }

    return reply.status(500).send(err) // TODO: fix me
  }



}