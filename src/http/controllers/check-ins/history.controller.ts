import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchUserCheckInsService } from "@/services/factories/fetch-user-check-ins-history-service";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1)
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const fetchUserCheckInsService = makeFetchUserCheckInsService();
  const { checkIns } = await fetchUserCheckInsService.execute({ userId: request.user.sub, page });

  return reply.code(200).send(checkIns);
}
