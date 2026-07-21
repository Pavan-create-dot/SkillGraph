import { careerGoalRepository } from '../repositories/careerGoal.repository';
import { ApiError } from '../utils/ApiError';

export class CareerGoalService {
  async list() {
    return careerGoalRepository.list();
  }

  async selectCareerGoal(userId: string, careerGoalId: string) {
    const careerGoal = await careerGoalRepository.findById(careerGoalId);
    if (!careerGoal) {
      throw ApiError.notFound('Career goal not found');
    }

    return careerGoalRepository.selectForUser(userId, careerGoalId);
  }
}

export const careerGoalService = new CareerGoalService();
