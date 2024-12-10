import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { InvalidCredentialsError } from "@/services/Errors/invalid-credentials-error";
import { makeAuthenticationService } from "@/services/factories/make-authentication-service";

export async function authetication(request: FastifyRequest, reply: FastifyReply) {
  const autheticationBodySchema = z.object({
    email: z.string(),
    password: z.string().min(8),
  });

  const { email, password } = autheticationBodySchema.parse(request.body);

  try {
    const authenticationService = makeAuthenticationService();
    const { user } = await authenticationService.execute({ email, password });

    const token = await reply.jwtSign({}, {
      sign: {
        sub: user.id
      }
    })

    const refreshToken = await reply.jwtSign({}, {
      sign: {
        sub: user.id,
        expiresIn: '7d'
      }
    })

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true
      })
      .code(200)
      .send({ token });

  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err;
  }

}
