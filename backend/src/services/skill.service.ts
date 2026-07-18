import { skillRepository } from '../repositories/skill.repository';

export interface SkillListParams {
  page?: number;
  limit?: number;
  category?: string;
}

export interface PaginatedSkills {
  data: Awaited<ReturnType<typeof skillRepository.findAll>>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class SkillService {
  async listSkills(params: SkillListParams = {}): Promise<PaginatedSkills> {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      skillRepository.findAll({ skip, take: limit, category: params.category }),
      skillRepository.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCategories(): Promise<string[]> {
    return skillRepository.findCategories();
  }

  async getGraphData() {
    return skillRepository.getGraphData();
  }
}

export const skillService = new SkillService();
