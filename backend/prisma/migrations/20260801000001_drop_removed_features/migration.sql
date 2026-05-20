-- Drop tables and columns removed from the schema.
-- All statements are guarded so this is safe to re-run.

-- Drop ats_checks table (removed feature)
DROP TABLE IF EXISTS "ats_checks";

-- Drop out-of-scope tables from the original scaffold
DROP TABLE IF EXISTS "progress";
DROP TABLE IF EXISTS "skill_edges";
DROP TABLE IF EXISTS "skills";
DROP TABLE IF EXISTS "career_goals";
DROP TABLE IF EXISTS "study_plans";
DROP TABLE IF EXISTS "roadmap_nodes";
DROP TABLE IF EXISTS "roadmap_edges";

-- Drop removed enums
DO $$ BEGIN
  DROP TYPE "SkillDifficulty";
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

DO $$ BEGIN
  DROP TYPE "ProgressStatus";
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

-- Drop removed columns from users (github_username, leetcode_username)
DO $$ BEGIN
  ALTER TABLE "users" DROP COLUMN IF EXISTS "github_username";
EXCEPTION
  WHEN others THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "users" DROP COLUMN IF EXISTS "leetcode_username";
EXCEPTION
  WHEN others THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "users" DROP COLUMN IF EXISTS "selected_career_goal_id";
EXCEPTION
  WHEN others THEN null;
END $$;

-- Add missing columns to users if they weren't in the original schema
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "target_role" VARCHAR(100) DEFAULT 'Full-Stack Developer';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resume_text" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resume_parsed" JSONB;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resume_analysis" JSONB;
