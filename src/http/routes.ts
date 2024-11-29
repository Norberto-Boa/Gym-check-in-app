import { FastifyInstance } from "fastify";
import { register } from "./controllers/register.controller";
import { authetication } from "./controllers/authetication.controller";
import { profile } from "./controllers/profile.controller";
import { verifyJWT } from "./middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authetication)

  /**
   * Protected routes
   */
  app.get('/me', { onRequest: [verifyJWT] }, profile);
}