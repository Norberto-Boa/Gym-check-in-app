import type { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterServiceRequest {
  name: string;
  email: string,
  password: string
}

export class RegisterService {

  constructor(private userRepository: UsersRepository) { }

  async execute({ name, email, password }: RegisterServiceRequest) {
    const passwordHash = await hash(password, 6);

    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    // const prismaUserRepository = new PrismaUsersRepository();

    const user = await this.userRepository.create({ name, email, password: passwordHash });

    return user;
  }
}
