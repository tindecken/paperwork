ALTER TABLE "users" RENAME COLUMN "password" TO "hash";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "salt" text NOT NULL;