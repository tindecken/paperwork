ALTER TABLE `users` RENAME TO `user`;--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`systemRole` text DEFAULT 'user' NOT NULL,
	`type` text DEFAULT 'free' NOT NULL,
	`avatar` blob,
	`themeId` text NOT NULL,
	`isActivated` integer DEFAULT 0 NOT NULL,
	`isDeleted` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`themeId`) REFERENCES `themes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "name", "email", "email_verified", "image", "created_at", "updated_at", "systemRole", "type", "avatar", "themeId", "isActivated", "isDeleted") SELECT "id", "name", "email", "email_verified", "image", "created_at", "updated_at", "systemRole", "type", "avatar", "themeId", "isActivated", "isDeleted" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
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
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`fileId`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_userFiles`("id", "userId", "fileId", "role", "isSelected", "createdAt", "createdBy", "updatedAt", "updatedBy", "isDeleted") SELECT "id", "userId", "fileId", "role", "isSelected", "createdAt", "createdBy", "updatedAt", "updatedBy", "isDeleted" FROM `userFiles`;--> statement-breakpoint
DROP TABLE `userFiles`;--> statement-breakpoint
ALTER TABLE `__new_userFiles` RENAME TO `userFiles`;--> statement-breakpoint
CREATE TABLE `__new_usersSettings` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`createdBy` text,
	`updatedAt` text,
	`updatedBy` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `settings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_usersSettings`("id", "userId", "createdAt", "createdBy", "updatedAt", "updatedBy") SELECT "id", "userId", "createdAt", "createdBy", "updatedAt", "updatedBy" FROM `usersSettings`;--> statement-breakpoint
DROP TABLE `usersSettings`;--> statement-breakpoint
ALTER TABLE `__new_usersSettings` RENAME TO `usersSettings`;