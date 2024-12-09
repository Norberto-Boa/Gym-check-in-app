import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search.controller";
import { findNearby } from "./nearby.controller";
import { create } from "./create.controller";

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.get('/gyms/search', search);
  app.get('/gyms/nearby', findNearby);

  app.post('/gym', create);

}