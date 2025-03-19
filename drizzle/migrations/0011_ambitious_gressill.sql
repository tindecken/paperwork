ALTER TABLE `sessions` ADD `selectedFileId` text;--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_selectedFileId_unique` ON `sessions` (`selectedFileId`);