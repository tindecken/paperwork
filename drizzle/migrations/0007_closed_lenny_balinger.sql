CREATE TABLE `usersThemes` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`themeId` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`createdBy` text,
	`updatedAt` text,
	`updatedBy` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`themeId`) REFERENCES `themes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `settings` ADD `description` text;