CREATE TABLE `themes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`createdBy` text,
	`updatedAt` text,
	`updatedBy` text,
	`isDeleted` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `usersThemes` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`themeId` text NOT NULL,
	`createdBy` text,
	`updatedAt` text,
	`updatedBy` text,
	`isDeleted` integer DEFAULT 0 NOT NULL
);
