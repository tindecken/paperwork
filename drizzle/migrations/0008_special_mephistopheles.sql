ALTER TABLE `userFiles` RENAME TO `usersFiles`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_usersFiles` (
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
INSERT INTO `__new_usersFiles`("id", "userId", "fileId", "role", "isSelected", "createdAt", "createdBy", "updatedAt", "updatedBy", "isDeleted") SELECT "id", "userId", "fileId", "role", "isSelected", "createdAt", "createdBy", "updatedAt", "updatedBy", "isDeleted" FROM `usersFiles`;--> statement-breakpoint
DROP TABLE `usersFiles`;--> statement-breakpoint
ALTER TABLE `__new_usersFiles` RENAME TO `usersFiles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;