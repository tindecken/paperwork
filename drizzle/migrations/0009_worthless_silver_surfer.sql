ALTER TABLE "documents" ALTER COLUMN "file" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean NOT NULL;