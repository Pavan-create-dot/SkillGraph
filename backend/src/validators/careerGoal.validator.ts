import { z } from 'zod';

export const selectCareerGoalSchema = z.object({
  body: z.object({
    careerGoalId: z
      .string()
      .min(1, 'Career goal ID is required')
      .uuid('Career goal ID must be a valid UUID'),
  }),
});

export type SelectCareerGoalInput = z.infer<typeof selectCareerGoalSchema>['body'];
