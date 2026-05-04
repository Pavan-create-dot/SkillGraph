import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { aiService } from './ai.service';
import { logger } from '../config/logger';

export class InterviewService {
  async startSession(userId: string, type: 'HR' | 'TECHNICAL' | 'BEHAVIOURAL') {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound('User not found');

    const resumeParsed = (user.resumeParsed as any) || {};
    const resumeSkills = Array.isArray(resumeParsed.skills) ? resumeParsed.skills : [];
    const targetRole = user.targetRole || 'Software Development Engineer';

    // Generate questions from AI
    const questions = await aiService.generateInterviewQuestions({
      targetRole,
      resumeSkills,
      type,
    });

    // Create session in database
    const session = await prisma.interviewSession.create({
      data: {
        userId,
        type,
        questions: {
          create: questions.map((q) => ({
            questionText: q.questionText,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return session;
  }

  async submitAnswer(userId: string, sessionId: string, questionId: string, userAnswer: string) {
    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw ApiError.notFound('Interview session not found');

    const question = await prisma.interviewQuestion.findFirst({
      where: { id: questionId, sessionId },
    });
    if (!question) throw ApiError.notFound('Question not found');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const targetRole = user?.targetRole || 'Software Developer';

    // Evaluate answer with Gemini AI
    const evaluation = await aiService.evaluateInterviewAnswer(
      question.questionText,
      userAnswer,
      targetRole,
    );

    // Save evaluation results
    const updatedQuestion = await prisma.interviewQuestion.update({
      where: { id: questionId },
      data: {
        userAnswer,
        score: evaluation.score,
        feedback: evaluation.feedback,
        suggestedImprovements: evaluation.suggestedImprovements,
        modelAnswer: evaluation.modelAnswer,
      },
    });

    return updatedQuestion;
  }

  async getSession(userId: string, sessionId: string) {
    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
      include: { questions: true },
    });
    if (!session) throw ApiError.notFound('Interview session not found');
    return session;
  }

  async getHistory(userId: string) {
    return prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { questions: true },
      take: 10,
    });
  }
}

export const interviewService = new InterviewService();
