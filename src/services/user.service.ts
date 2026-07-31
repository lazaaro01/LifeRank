import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/user.repository";
import type { RegisterInput, UpdateProfileInput } from "@/utils/validators/auth.schema";
import { ServiceError } from "@/services/errors";
import type { UserModel } from "@/generated/prisma/models";

const PASSWORD_SALT_ROUNDS = 10;

export type SafeUser = Omit<UserModel, "passwordHash">;

function toSafeUser({ passwordHash, ...safeUser }: UserModel): SafeUser {
  void passwordHash;
  return safeUser;
}

export const userService = {
  async register(input: RegisterInput): Promise<SafeUser> {
    const [emailTaken, usernameTaken] = await Promise.all([
      userRepository.findByEmail(input.email),
      userRepository.findByUsername(input.username),
    ]);

    if (emailTaken) {
      throw new ServiceError("Este email já está em uso", "email");
    }

    if (usernameTaken) {
      throw new ServiceError("Este username já está em uso", "username");
    }

    const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);

    const user = await userRepository.create({
      name: input.name,
      username: input.username,
      email: input.email,
      passwordHash,
      phone: input.phone || undefined,
      bio: input.bio || undefined,
    });

    return toSafeUser(user);
  },

  async verifyCredentials(email: string, password: string): Promise<SafeUser | null> {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    return toSafeUser(user);
  },

  async getProfile(id: string): Promise<SafeUser | null> {
    const user = await userRepository.findById(id);
    return user ? toSafeUser(user) : null;
  },

  async updateProfile(id: string, input: UpdateProfileInput): Promise<SafeUser> {
    const user = await userRepository.update(id, {
      name: input.name,
      avatarUrl: input.avatarUrl || undefined,
      phone: input.phone || undefined,
      bio: input.bio || undefined,
    });

    return toSafeUser(user);
  },
};
