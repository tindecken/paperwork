ALTER TABLE `users` ADD `hash` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `salt` text NOT NULL;