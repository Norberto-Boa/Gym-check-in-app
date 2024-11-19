import { compare } from 'bcryptjs';
import type { UsersRepository } from '../repositories/users-repository';
import { InvalidCredentialsError } from './Errors/invalid-credentials-error';
import { User } from '@prisma/client';

interface AuthenticationServiceRequest {
  email: string,
  password: string
}

interface AuthenticationServiceResponse {
  user: User
}

export class AuthenticationService {
  constructor(
    private usersRepository: UsersRepository,
  ) { }

  async execute({ email, password }: AuthenticationServiceRequest): Promise<AuthenticationServiceResponse> {

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}