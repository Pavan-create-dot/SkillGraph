import { z } from 'zod';

export const createEdgeSchema = z.object({
  body: z.object({
    parentSkillId: z
      .string()
      .min(1, 'Parent skill ID is required')
      .uuid('Parent skill ID must be a valid UUID'),
    childSkillId: z
      .string()
      .min(1, 'Child skill ID is required')
      .uuid('Child skill ID must be a valid UUID'),
  }),
});

export type CreateEdgeInput = z.infer<typeof createEdgeSchema>['body'];
