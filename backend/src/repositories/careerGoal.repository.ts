import { prisma } from '../config/database';

export class CareerGoalRepository {
  async list() {
    return prisma.careerGoal.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.careerGoal.findUnique({
      where: { id },
    });
  }

  async selectForUser(userId: string, careerGoalId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { selectedCareerGoalId: careerGoalId },
      include: {
        selectedCareerGoal: true,
      },
    });
  }
}

export const careerGoalRepository = new CareerGoalRepository();
