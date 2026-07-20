import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

export interface RoadmapInput {
  topic: string;
  currentLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  goalType: 'GET_JOB' | 'SIDE_PROJECT' | 'CURIOSITY' | 'ACADEMIC';
  hoursPerWeek: number;
}

export interface GeneratedSkill {
  name: string;
  category: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface GeneratedEdge {
  from: string;
  to: string;
}

export interface GeneratedRoadmap {
  roadmapTitle: string;
  skills: GeneratedSkill[];
  edges: GeneratedEdge[];
}

const GOAL_LABELS: Record<RoadmapInput['goalType'], string> = {
  GET_JOB: 'get a job in this field',
  SIDE_PROJECT: 'build a side project',
  CURIOSITY: 'learn out of curiosity',
  ACADEMIC: 'study it academically',
};

export class AiService {
  private getClient() {
    if (!env.GEMINI_API_KEY) {
      throw ApiError.internal('AI service is not configured. Please set GEMINI_API_KEY.');
    }
    return new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  async generateRoadmap(input: RoadmapInput): Promise<GeneratedRoadmap> {
    const genAI = this.getClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert learning coach and curriculum designer.

A user wants a personalized learning roadmap with these details:
- Topic they want to learn: "${input.topic}"
- Current level: ${input.currentLevel}
- Goal: ${GOAL_LABELS[input.goalType]}
- Available time: ${input.hoursPerWeek} hours per week

Create a structured learning roadmap with 8–16 skills. Each skill should be a concrete, learnable topic (not too broad, not too narrow).

Rules:
1. Skills must be ordered from foundational to advanced
2. Prerequisites must be respected in the edges (a skill can only depend on earlier skills)
3. Skills should be practical and specific (e.g. "React Hooks" not just "React")
4. Each skill needs a clear one-sentence description
5. Difficulty must match the skill's complexity: BEGINNER / INTERMEDIATE / ADVANCED
6. Categories should group related skills (e.g. "Frontend", "Backend", "Database", "Fundamentals")
7. Do NOT include soft skills or career advice — only technical/subject skills

Respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "roadmapTitle": "string — concise title like 'React Developer Path'",
  "skills": [
    {
      "name": "string — specific skill name",
      "category": "string — category grouping",
      "description": "string — one clear sentence what this skill covers",
      "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
    }
  ],
  "edges": [
    {
      "from": "exact skill name (prerequisite)",
      "to": "exact skill name (depends on the from skill)"
    }
  ]
}`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      // Strip markdown code fences if present
      const jsonText = text
        .replace(/^```(?:json)?\n?/, '')
        .replace(/\n?```$/, '')
        .trim();

      const parsed: GeneratedRoadmap = JSON.parse(jsonText);

      // Basic validation
      if (!parsed.skills || !Array.isArray(parsed.skills) || parsed.skills.length === 0) {
        throw new Error('AI returned invalid roadmap structure');
      }

      return parsed;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown AI error';
      throw ApiError.internal(`Failed to generate roadmap: ${message}`);
    }
  }
}

export const aiService = new AiService();
