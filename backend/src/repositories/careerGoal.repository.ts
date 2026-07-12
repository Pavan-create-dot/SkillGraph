import { prisma } from '../config/database';

export class CareerGoalRepository {
  async findAll() {
    return prisma.careerGoal.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.careerGoal.findUnique({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return prisma.careerGoal.count();
  }
}

export const careerGoalRepository = new CareerGoalRepository();
