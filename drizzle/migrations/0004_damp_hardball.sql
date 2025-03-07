ALTER TABLE `user` ADD `isEmailVerified` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `email_verified`;