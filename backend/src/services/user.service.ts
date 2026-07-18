import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';

export class UserService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  async updateSelectedCareerGoal(userId: string, careerGoalId: string | null) {
    const user = await userRepository.updateSelectedCareerGoal(userId, careerGoalId);
    return user;
  }
}

export const userService = new UserService();
