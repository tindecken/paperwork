DROP INDEX "fileId_name";--> statement-breakpoint
DROP INDEX "sessions_token_unique";--> statement-breakpoint
DROP INDEX "settings_key_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "avatar" TO "avatar" text;--> statement-breakpoint
CREATE UNIQUE INDEX `fileId_name` ON `categories` (`fileId`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `users` ADD `userType` text DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `type`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `themeId`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `isActivated`;