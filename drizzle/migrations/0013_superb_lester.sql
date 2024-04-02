ALTER TABLE "users" RENAME COLUMN "username" TO "userName";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_userName_unique" UNIQUE("userName");