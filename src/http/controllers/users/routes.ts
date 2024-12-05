import { FastifyInstance } from "fastify";
import { register } from "./register.controller";
import { authetication } from "./authetication.controller";
import { profile } from "./profile.controller";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authetication)

  /**
   * Protected routes
   */
  app.get('/me', { onRequest: [verifyJWT] }, profile);


}