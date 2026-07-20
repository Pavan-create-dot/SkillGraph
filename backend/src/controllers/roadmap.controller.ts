import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { aiService } from '../services/ai.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

// ── Validation schema ──────────────────────────────────────────────────────

const generateRoadmapSchema = z.object({
  body: z.object({
    topic: z.string().min(2).max(200),
    currentLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    goalType: z.enum(['GET_JOB', 'SIDE_PROJECT', 'CURIOSITY', 'ACADEMIC']),
    hoursPerWeek: z.number().int().min(1).max(80),
  }),
});

// ── Handlers ───────────────────────────────────────────────────────────────

/**
 * POST /api/v1/roadmap/generate
 * Calls Gemini AI to generate a learning path, saves skills + edges + roadmap links.
 */
export const generateRoadmap = asyncHandler(async (req: Request, res: Response) => {
  const { body } = generateRoadmapSchema.parse({ body: req.body });
  const userId = req.user!.id;

  // Call Gemini AI
  const generated = await aiService.generateRoadmap(body);

  // Save everything in a transaction
  const result = await prisma.$transaction(async (tx: any) => {
    const createdSkills: { id: string; name: string }[] = [];

    // Create skills (upsert by name to avoid duplicates)
    for (const s of generated.skills) {
      const skill = await tx.skill.upsert({
        where: { name: s.name },
        update: {}, // don't overwrite existing admin skills
        create: {
          name: s.name,
          category: s.category,
          description: s.description,
          difficulty: s.difficulty,
          isUserGenerated: true,
        },
      });
      createdSkills.push({ id: skill.id, name: skill.name });
    }

    // Build a name → id map for edge creation
    const nameToId = new Map(createdSkills.map((s) => [s.name, s.id]));

    // Create skill edges (prerequisites)
    for (const edge of generated.edges) {
      const parentId = nameToId.get(edge.from);
      const childId = nameToId.get(edge.to);
      if (!parentId || !childId) continue;

      await tx.skillEdge.upsert({
        where: {
          parentSkillId_childSkillId: { parentSkillId: parentId, childSkillId: childId },
        },
        update: {},
        create: { parentSkillId: parentId, childSkillId: childId },
      });
    }

    // Remove old roadmap entries for this user (regeneration support)
    await tx.userRoadmap.deleteMany({ where: { userId } });

    // Link each skill to the user's roadmap
    await tx.userRoadmap.createMany({
      data: createdSkills.map((s) => ({
        userId,
        skillId: s.id,
        topic: body.topic,
      })),
      skipDuplicates: true,
    });

    return {
      roadmapTitle: generated.roadmapTitle,
      topic: body.topic,
      skillCount: createdSkills.length,
      edgeCount: generated.edges.length,
    };
  });

  res.status(201).json(new ApiResponse(201, 'Roadmap generated successfully', result));
});

/**
 * GET /api/v1/roadmap/mine
 * Returns the current user's roadmap: their personal skills + edges between them.
 */
export const getMyRoadmap = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const roadmapEntries = await prisma.userRoadmap.findMany({
    where: { userId },
    include: {
      skill: {
        include: {
          parentEdges: true,
          childEdges: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  if (roadmapEntries.length === 0) {
    throw ApiError.notFound('No roadmap found. Please generate your learning path first.');
  }

  const topic = roadmapEntries[0].topic;
  const skillIds = new Set(roadmapEntries.map((r: any) => r.skillId));

  // Nodes: user's personal skills
  const nodes = roadmapEntries.map((r: any) => r.skill);

  // Edges: only those connecting skills inside this user's roadmap
  const edgeSet = new Set<string>();
  const edges: { id: string; parentSkillId: string; childSkillId: string }[] = [];

  for (const entry of roadmapEntries) {
    for (const edge of entry.skill.parentEdges) {
      if (skillIds.has(edge.childSkillId) && !edgeSet.has(edge.id)) {
        edgeSet.add(edge.id);
        edges.push(edge);
      }
    }
  }

  res.status(200).json(
    ApiResponse.ok('Roadmap retrieved successfully', {
      topic,
      nodes: nodes.map(({ parentEdges: _p, childEdges: _c, ...rest }: any) => rest),
      edges,
    }),
  );
});

/**
 * GET /api/v1/roadmap/status
 * Returns whether the current user has a roadmap.
 */
export const getRoadmapStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const count = await prisma.userRoadmap.count({ where: { userId } });
  const hasTopic =
    count > 0
      ? (await prisma.userRoadmap.findFirst({ where: { userId }, select: { topic: true } }))?.topic
      : null;

  res
    .status(200)
    .json(ApiResponse.ok('Status retrieved', { hasRoadmap: count > 0, topic: hasTopic }));
});
