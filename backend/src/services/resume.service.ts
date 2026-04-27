import { prisma } from '../config/database';
import { aiService } from './ai.service';
import { ApiError } from '../utils/ApiError';

export class ResumeService {
  async getResumeAnalysis(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        resumeText: true,
        resumeParsed: true,
        resumeAnalysis: true,
        targetRole: true,
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return {
      resumeText: user.resumeText,
      parsed: user.resumeParsed,
      analysis: user.resumeAnalysis,
      targetRole: user.targetRole || 'Full-Stack Developer',
    };
  }

  async analyzeAndSaveResume(userId: string, rawText: string) {
    if (!rawText || rawText.trim().length < 50) {
      throw ApiError.badRequest('Resume text must be at least 50 characters long.');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { targetRole: true },
    });

    const targetRole = user?.targetRole || 'Full-Stack Developer';

    // Call AI service
    const result = await aiService.analyzeResume(rawText, targetRole);

    // Save to user model
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        resumeText: rawText,
        resumeParsed: result.parsed as any,
        resumeAnalysis: result.analysis as any,
      },
      select: {
        resumeText: true,
        resumeParsed: true,
        resumeAnalysis: true,
        targetRole: true,
      },
    });

    return {
      resumeText: updatedUser.resumeText,
      parsed: updatedUser.resumeParsed,
      analysis: updatedUser.resumeAnalysis,
      targetRole: updatedUser.targetRole || 'Full-Stack Developer',
    };
  }
}

export const resumeService = new ResumeService();
