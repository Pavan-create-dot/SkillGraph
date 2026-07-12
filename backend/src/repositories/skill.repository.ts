import { prisma } from '../config/database';

export class SkillRepository {
  async findAll(params?: { skip?: number; take?: number; category?: string }) {
    return prisma.skill.findMany({
      skip: params?.skip,
      take: params?.take,
      where: params?.category ? { category: params.category } : undefined,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async findById(id: string) {
    return prisma.skill.findUnique({
      where: { id },
      include: {
        childEdges: {
          include: { childSkill: true },
        },
        parentEdges: {
          include: { parentSkill: true },
        },
      },
    });
  }

  async findCategories(): Promise<string[]> {
    const results = await prisma.skill.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return results.map((r: { category: string }) => r.category);
  }

  async count(): Promise<number> {
    return prisma.skill.count();
  }
}

export const skillRepository = new SkillRepository();
