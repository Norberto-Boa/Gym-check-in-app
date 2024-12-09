import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateGymService } from "@/services/factories/make-create-gym-service";
import { makeCheckInService } from "@/services/factories/make-check-in-service";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParams = z.object({
    gymId: z.string().uuid()
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 180
    }),
  });

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);
  const { gymId } = createCheckInParams.parse(request.params);

  const createCheckInService = makeCheckInService();
  const { checkIn } = await createCheckInService.execute({ gymId, userId: request.user.sub, userLatitude: latitude, userLongitude: longitude });

  return reply.code(201).send(checkIn);
}
