import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

export class UserRepository {
  private defaultSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    targetRole: true,
    resumeText: true,
    resumeParsed: true,
    resumeAnalysis: true,
    createdAt: true,
    updatedAt: true,
  };

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: this.defaultSelect,
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: this.defaultSelect,
    });
  }

  /** Returns the full record including the hashed password — only for auth flows. */
  async findByEmailWithPassword(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: this.defaultSelect,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: this.defaultSelect,
    });
  }

  async findAll(params?: { skip?: number; take?: number }) {
    return prisma.user.findMany({
      skip: params?.skip,
      take: params?.take,
      select: this.defaultSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { email } });
    return count > 0;
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }
}

export const userRepository = new UserRepository();
