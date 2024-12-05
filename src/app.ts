import fastify from "fastify";
import { userRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "./env";
import { UserAlreadyExistsError } from "./services/Errors/user-already-exists-error";
import fastifyJwt from "@fastify/jwt";
import { gymRoutes } from "./http/controllers/gyms/route";

export const app = fastify();

app.register(fastifyJwt, {
	secret: env.JWT_SECRET
});
app.register(userRoutes);
app.register(gymRoutes);

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: "Validation error",
			issues: error.format(),
		});
	}

	if (error instanceof UserAlreadyExistsError) {
		return reply.code(409).send(error);
	}

	if (env.NODE_ENV !== "production") {
		console.error(error);
	} else {
		// TODO: Here we should log an external tool like DataDog/NewRelic/Sentry
	}

	return reply.status(500).send({ message: "Internal server Error" });
});
