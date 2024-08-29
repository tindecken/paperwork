ALTER TABLE `documents` ADD `updatedAt` integer;--> statement-breakpoint
ALTER TABLE `documents` ADD `updatedBy` text;--> statement-breakpoint
ALTER TABLE `users` ADD `password` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `hash`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `salt`;