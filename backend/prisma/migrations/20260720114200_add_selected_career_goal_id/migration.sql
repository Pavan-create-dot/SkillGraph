-- AlterTable
ALTER TABLE "users" ADD COLUMN "selected_career_goal_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_selected_career_goal_id_fkey" FOREIGN KEY ("selected_career_goal_id") REFERENCES "career_goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
