import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateGymService } from "@/services/factories/make-create-gym-service";
import { makeFetchNearbyGymsService } from "@/services/factories/make-fetch-nearby-gyms-service";

export async function findNearby(request: FastifyRequest, reply: FastifyReply) {
  const findNearbyQuerySchema = z.object({
    latitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 180
    }),
  });

  const { latitude, longitude } = findNearbyQuerySchema.parse(request.query);

  const fetchNearbyService = makeFetchNearbyGymsService();
  const { gyms } = await fetchNearbyService.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.code(200).send(gyms);
}
