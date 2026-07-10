-- Add session_role column to interview_sessions
-- Stores the role the user selected when starting the interview session

ALTER TABLE "interview_sessions" ADD COLUMN IF NOT EXISTS "session_role" VARCHAR(100);
