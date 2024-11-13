import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { registerService } from "@/services/register";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const user = await registerService({ name, email, password });


    return reply.code(201).send(user);
  } catch (err) {
    return reply.code(409).send(err);
  }



}