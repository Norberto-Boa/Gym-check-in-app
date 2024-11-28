import type { FastifyReply, FastifyRequest } from "fastify";
// import { z } from "zod";
// import { InvalidCredentialsError } from "@/services/Errors/invalid-credentials-error";
// import { makeAuthenticationService } from "@/services/factories/make-authentication-service";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify();

  console.log(request.user.sub);

  return reply.code(200).send();

}
