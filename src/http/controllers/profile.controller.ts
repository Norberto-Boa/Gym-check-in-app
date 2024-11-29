import { makeGetProfileService } from "@/services/factories/make-get-user-profile-service";
import type { FastifyReply, FastifyRequest } from "fastify";
// import { z } from "zod";
// import { InvalidCredentialsError } from "@/services/Errors/invalid-credentials-error";
// import { makeAuthenticationService } from "@/services/factories/make-authentication-service";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetProfileService();

  const { user } = await getUserProfile.execute({
    userId: request.user.sub
  });



  return reply.code(200).send({ ...user, password: undefined });

}
