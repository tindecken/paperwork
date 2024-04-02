CREATE TABLE IF NOT EXISTS "usersFiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"fileId" integer NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "is_active" TO "isActive";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "isActive" SET DEFAULT true;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersFiles" ADD CONSTRAINT "usersFiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersFiles" ADD CONSTRAINT "usersFiles_fileId_files_id_fk" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
