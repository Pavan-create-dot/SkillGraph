-- Idempotent init migration
-- Safe to apply against a database that already has the schema from earlier migrations.

-- CreateEnum (safe if already exists)
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable users
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "target_role" VARCHAR(100) DEFAULT 'Full-Stack Developer',
    "resume_text" TEXT,
    "resume_parsed" JSONB,
    "resume_analysis" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable interview_sessions
CREATE TABLE IF NOT EXISTS "interview_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "interview_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable interview_questions
CREATE TABLE IF NOT EXISTS "interview_questions" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "user_answer" TEXT,
    "feedback" TEXT,
    "suggested_improvements" TEXT,
    "model_answer" TEXT,
    "score" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "interview_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable blacklisted_tokens
CREATE TABLE IF NOT EXISTS "blacklisted_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blacklisted_tokens_pkey" PRIMARY KEY ("id")
);

-- Indexes (safe if already exist)
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key"         ON "users"("email");
CREATE INDEX       IF NOT EXISTS "users_email_idx"          ON "users"("email");
CREATE INDEX       IF NOT EXISTS "interview_sessions_user_id_idx"   ON "interview_sessions"("user_id");
CREATE INDEX       IF NOT EXISTS "interview_questions_session_id_idx" ON "interview_questions"("session_id");
CREATE UNIQUE INDEX IF NOT EXISTS "blacklisted_tokens_token_key"    ON "blacklisted_tokens"("token");

-- Foreign keys (safe if already exist)
DO $$ BEGIN
  ALTER TABLE "interview_sessions"
    ADD CONSTRAINT "interview_sessions_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "interview_questions"
    ADD CONSTRAINT "interview_questions_session_id_fkey"
    FOREIGN KEY ("session_id") REFERENCES "interview_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
