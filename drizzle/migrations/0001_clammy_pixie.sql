CREATE TABLE `categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(150) NOT NULL,
	`description` text(1000),
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text,
	`fileId` integer NOT NULL,
	FOREIGN KEY (`fileId`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` integer PRIMARY KEY NOT NULL,
	`fileName` text NOT NULL,
	`file` blob NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(150) NOT NULL,
	`description` text(1000),
	`createdBy` text(150),
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text
);
--> statement-breakpoint
CREATE TABLE `paperWorks` (
	`id` integer PRIMARY KEY NOT NULL,
	`categoryId` integer NOT NULL,
	`name` text(150) NOT NULL,
	`description` text(1000),
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text,
	`updatedBy` text(150),
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `paperWorksDocuments` (
	`id` integer PRIMARY KEY NOT NULL,
	`paperWorkId` integer NOT NULL,
	`documentId` integer NOT NULL,
	FOREIGN KEY (`paperWorkId`) REFERENCES `paperWorks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`documentId`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `usersFiles` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`fileId` integer NOT NULL,
	`role` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fileId`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `created_at` TO `createdAt`;--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `files_name_unique` ON `files` (`name`);