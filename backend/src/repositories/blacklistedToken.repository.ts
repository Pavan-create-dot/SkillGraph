import { prisma } from '../config/database';

export class BlacklistedTokenRepository {
  async add(token: string, expiresAt: Date): Promise<void> {
    await prisma.blacklistedToken.upsert({
      where: { token },
      update: {},
      create: {
        token,
        expiresAt,
      },
    });
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const count = await prisma.blacklistedToken.count({
      where: { token },
    });
    return count > 0;
  }

  async cleanExpired(): Promise<void> {
    await prisma.blacklistedToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}

export const blacklistedTokenRepository = new BlacklistedTokenRepository();
