import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateGymService } from "@/services/factories/make-create-gym-service";
import { makeCheckInService } from "@/services/factories/make-check-in-service";
import { makeValidateCheckInService } from "@/services/factories/make-validate-check-in-service";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParams = z.object({
    checkInId: z.string().uuid()
  })

  const { checkInId } = validateCheckInParams.parse(request.params);

  const makeValidateCheckIn = makeValidateCheckInService();
  const { checkIn } = await makeValidateCheckIn.execute({ checkInId });

  return reply.code(204).send(checkIn);
}
