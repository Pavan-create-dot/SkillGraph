import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { UpdateProfileInput } from '../validators/user.validator';

export class UserService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser && existingUser.id !== userId) {
      throw ApiError.conflict('Another account already uses this email address');
    }

    const updatedUser = await userRepository.update(userId, {
      name: input.name,
      email: input.email,
    });

    if (!updatedUser) {
      throw ApiError.notFound('User not found');
    }

    return updatedUser;
  }
}

export const userService = new UserService();
