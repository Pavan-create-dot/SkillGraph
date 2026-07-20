-- AlterTable: add is_user_generated to skills
ALTER TABLE "skills" ADD COLUMN "is_user_generated" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable: user_roadmaps join table
CREATE TABLE "user_roadmaps" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "topic" VARCHAR(300) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_roadmaps_user_id_idx" ON "user_roadmaps"("user_id");

-- CreateUniqueIndex
CREATE UNIQUE INDEX "user_roadmaps_user_id_skill_id_key" ON "user_roadmaps"("user_id", "skill_id");

-- AddForeignKey
ALTER TABLE "user_roadmaps" ADD CONSTRAINT "user_roadmaps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roadmaps" ADD CONSTRAINT "user_roadmaps_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
