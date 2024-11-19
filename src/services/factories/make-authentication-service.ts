import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticationService } from "../authentication.service";

export function makeAuthenticationService() {
  const userRepository = new PrismaUsersRepository();
  const authenticationService = new AuthenticationService(userRepository);

  return authenticationService
}