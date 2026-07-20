import { progressRepository } from '../repositories/progress.repository';

export class ProgressService {
  async getUserProgress(userId: string) {
    return progressRepository.findByUserId(userId);
  }

  async upsertProgress(
    userId: string,
    skillId: string,
    mastery: number,
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED',
  ) {
    return progressRepository.upsert(userId, skillId, mastery, status);
  }
}

export const progressService = new ProgressService();
