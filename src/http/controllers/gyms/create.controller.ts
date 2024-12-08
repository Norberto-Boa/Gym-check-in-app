import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateGymService } from "@/services/factories/make-create-gym-service";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    description: z.string().nullable(),
    phone: z.string().max(9).regex(new RegExp('^[0-9]+$')),
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 180
    }),
  });

  const { name, email, description, phone, latitude, longitude } = registerBodySchema.parse(request.body);

  const createGymService = makeCreateGymService();
  const user = await createGymService.execute({ name, email, description, phone, latitude, longitude });

  return reply.code(201).send(user);
}
