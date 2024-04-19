CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(150) NOT NULL,
	`userName` text(100) NOT NULL,
	`email` text(100) NOT NULL,
	`hash` text NOT NULL,
	`salt` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_userName_unique` ON `users` (`userName`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);