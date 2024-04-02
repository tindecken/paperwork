DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "files" DROP CONSTRAINT "files_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "usersFiles" ADD COLUMN "role" "role" NOT NULL;--> statement-breakpoint
ALTER TABLE "files" DROP COLUMN IF EXISTS "user_id";