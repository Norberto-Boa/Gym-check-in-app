import { FastifyInstance } from "fastify";
import { register } from "./register.controller";
import { authetication } from "./authetication.controller";
import { profile } from "./profile.controller";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { refresh } from "./refresh.controller";

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authetication)

  app.patch('/token/refresh', refresh)

  /**
   * Protected routes
   */
  app.get('/me', { onRequest: [verifyJWT] }, profile);


}