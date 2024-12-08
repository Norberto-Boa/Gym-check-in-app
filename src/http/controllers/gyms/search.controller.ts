import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeSearchGymService } from "@/services/factories/make-search-gym-service";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1)
  });

  const { q, page } = searchQuerySchema.parse(request.body);

  const searchGymService = makeSearchGymService();
  const { gyms } = await searchGymService.execute({ query: q, page });

  return reply.code(201).send(gyms);
}
