import { z } from 'zod';

export const selectCareerGoalSchema = z.object({
  body: z.object({
    careerGoalId: z.string().uuid('Career goal id must be a valid UUID'),
  }),
});

export type SelectCareerGoalInput = z.infer<typeof selectCareerGoalSchema>['body'];
