import { careerGoalRepository } from '../repositories/careerGoal.repository';
import { ApiError } from '../utils/ApiError';
import { SelectCareerGoalInput } from '../validators/careerGoal.validator';
import { logger } from '../config/logger';

export class CareerGoalService {
  async listCareerGoals() {
    return careerGoalRepository.findAll();
  }

  async selectCareerGoal(userId: string, input: SelectCareerGoalInput) {
    const careerGoal = await careerGoalRepository.findById(input.careerGoalId);

    if (!careerGoal) {
      throw ApiError.notFound(`Career goal with ID '${input.careerGoalId}' not found`);
    }

    // Career goal selection is recorded — adaptive learning engine will build
    // upon this in Phase 2. For now, we validate and return the selected goal.
    logger.info({
      msg: 'User selected career goal',
      userId,
      careerGoalId: careerGoal.id,
      careerGoalName: careerGoal.name,
    });

    return {
      message: `Career goal '${careerGoal.name}' selected successfully`,
      careerGoal,
    };
  }
}

export const careerGoalService = new CareerGoalService();
