CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`isEmailVerified` integer NOT NULL,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`systemRole` text DEFAULT 'user' NOT NULL,
	`type` text DEFAULT 'free' NOT NULL,
	`avatar` blob,
	`themeId` text NOT NULL,
	`isActivated` integer DEFAULT 0 NOT NULL,
	`isDeleted` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`themeId`) REFERENCES `themes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
DROP TABLE `verification`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_userFiles` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`fileId` text NOT NULL,
	`role` text NOT NULL,
	`isSelected` integer DEFAULT 0 NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`createdBy` text,
	`updatedAt` text,
	`updatedBy` text,
	`isDeleted` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`fileId`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_userFiles`("id", "userId", "fileId", "role", "isSelected", "createdAt", "createdBy", "updatedAt", "updatedBy", "isDeleted") SELECT "id", "userId", "fileId", "role", "isSelected", "createdAt", "createdBy", "updatedAt", "updatedBy", "isDeleted" FROM `userFiles`;--> statement-breakpoint
DROP TABLE `userFiles`;--> statement-breakpoint
ALTER TABLE `__new_userFiles` RENAME TO `userFiles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_usersSettings` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`createdBy` text,
	`updatedAt` text,
	`updatedBy` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `settings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_usersSettings`("id", "userId", "createdAt", "createdBy", "updatedAt", "updatedBy") SELECT "id", "userId", "createdAt", "createdBy", "updatedAt", "updatedBy" FROM `usersSettings`;--> statement-breakpoint
DROP TABLE `usersSettings`;--> statement-breakpoint
ALTER TABLE `__new_usersSettings` RENAME TO `usersSettings`;