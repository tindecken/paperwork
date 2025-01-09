DROP INDEX "fileId_name";--> statement-breakpoint
DROP INDEX "settings_key_unique";--> statement-breakpoint
DROP INDEX "users_userName_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `documents` ALTER COLUMN "filePath" TO "filePath" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `fileId_name` ON `categories` (`fileId`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_userName_unique` ON `users` (`userName`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `documents` ADD `reducedFilePath` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `coverPath` text;--> statement-breakpoint
ALTER TABLE `documents` DROP COLUMN `fileBlob`;--> statement-breakpoint
ALTER TABLE `documents` DROP COLUMN `coverBlob`;--> statement-breakpoint
ALTER TABLE `documents` DROP COLUMN `reducedBlob`;--> statement-breakpoint
ALTER TABLE `documents` DROP COLUMN `reducedSize`;--> statement-breakpoint
ALTER TABLE `documents` DROP COLUMN `reducedPath`;