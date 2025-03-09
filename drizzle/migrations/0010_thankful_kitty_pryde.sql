DROP INDEX "fileId_name";--> statement-breakpoint
DROP INDEX "sessions_token_unique";--> statement-breakpoint
DROP INDEX "settings_key_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `accounts` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
CREATE UNIQUE INDEX `fileId_name` ON `categories` (`fileId`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `accounts` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `categories` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
ALTER TABLE `categories` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `documents` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
ALTER TABLE `documents` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `files` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
ALTER TABLE `files` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `logs` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
ALTER TABLE `paperworksCategories` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
ALTER TABLE `paperworksCategories` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `paperworks` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
ALTER TABLE `paperworks` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `sessions` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
ALTER TABLE `sessions` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `settings` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
ALTER TABLE `settings` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `themes` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
ALTER TABLE `themes` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `usersFiles` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
ALTER TABLE `usersFiles` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `usersSettings` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
ALTER TABLE `usersSettings` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `usersThemes` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
ALTER TABLE `usersThemes` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `verifications` ALTER COLUMN "createdAt" TO "createdAt" integer DEFAULT (unixepoch());