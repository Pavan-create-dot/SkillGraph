import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';

export interface ResumeAnalysisResult {
  parsed: {
    summary: string;
    skills: string[];
    education: string[];
    experience: string[];
    projects: string[];
    certifications: string[];
  };
  analysis: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    missingSkills: string[];
    suggestions: string[];
  };
}

export interface GeneratedQuestion {
  id: string;
  questionText: string;
  type: 'HR' | 'TECHNICAL' | 'BEHAVIOURAL';
  context: string;
}

export interface EvaluationResult {
  feedback: string;
  suggestedImprovements: string;
  modelAnswer: string;
  score: number;
}

export class AiService {
  private getClient() {
    if (!env.GEMINI_API_KEY) {
      throw ApiError.internal('AI service is not configured. Please set GEMINI_API_KEY.');
    }
    return new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  private async generateJSON<T>(prompt: string): Promise<T> {
    const genAI = this.getClient();
    const modelsToTry = [
      'gemini-flash-latest',
      'gemini-flash-lite-latest',
      'gemini-2.0-flash-lite',
      'gemini-1.5-flash',
    ];

    let lastError: unknown = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        const jsonText = text
          .replace(/^```(?:json)?\n?/, '')
          .replace(/\n?```$/, '')
          .trim();

        return JSON.parse(jsonText) as T;
      } catch (err) {
        lastError = err;
        logger.warn(
          `Model ${modelName} call failed: ${err instanceof Error ? err.message : String(err)}. Trying fallback...`,
        );
      }
    }

    const message = lastError instanceof Error ? lastError.message : 'AI model processing error';
    throw ApiError.internal(`AI generation failed: ${message}`);
  }

  async analyzeResume(resumeText: string, targetRole: string): Promise<ResumeAnalysisResult> {
    const prompt = `You are an expert technical recruiter and resume evaluator for campus placements.

Analyze the following student resume for the target role "${targetRole}".

Resume Text:
"""
${resumeText}
"""

Respond ONLY with valid JSON in this exact structure:
{
  "parsed": {
    "summary": "1-2 sentence overview of candidate profile",
    "skills": ["Array of technical skills identified"],
    "education": ["Array of degrees/institutions"],
    "experience": ["Array of past roles/internships"],
    "projects": ["Array of project names/descriptions"],
    "certifications": ["Array of certifications"]
  },
  "analysis": {
    "summary": "AI summary of candidate placement readiness",
    "strengths": ["Top 3 key strengths"],
    "weaknesses": ["2-3 areas for improvement"],
    "missingSkills": ["Key skills missing for ${targetRole}"],
    "suggestions": ["3 actionable tips to improve resume score"]
  }
}`;

    return this.generateJSON<ResumeAnalysisResult>(prompt);
  }

  async generateInterviewQuestions(context: {
    targetRole: string;
    resumeSkills: string[];
    type: string;
  }): Promise<GeneratedQuestion[]> {
    const prompt = `You are a technical interviewer conducting a ${context.type} placement interview for a "${context.targetRole}" position.

Candidate Skills: ${context.resumeSkills.join(', ')}

Generate 4 realistic, challenging interview questions tailored specifically to candidate skills and target role.

Respond ONLY with valid JSON:
[
  {
    "id": "q1",
    "questionText": "Question wording...",
    "type": "${context.type.toUpperCase()}",
    "context": "Brief tip on what the interviewer is assessing"
  }
]`;

    return this.generateJSON<GeneratedQuestion[]>(prompt);
  }

  async evaluateInterviewAnswer(
    questionText: string,
    userAnswer: string,
    targetRole: string,
  ): Promise<EvaluationResult> {
    const prompt = `You are an expert technical interviewer evaluating a candidate's answer for "${targetRole}".

Question: "${questionText}"
Candidate Answer: "${userAnswer}"

Evaluate correctness, depth, communication clarity, and technical accuracy.

Respond ONLY with valid JSON:
{
  "score": 85 (Integer between 0 and 100),
  "feedback": "Detailed feedback on candidate answer",
  "suggestedImprovements": "Specific ways candidate could make answer stronger",
  "modelAnswer": "Comprehensive exemplar model answer for comparison"
}`;

    return this.generateJSON<EvaluationResult>(prompt);
  }
}

export const aiService = new AiService();
