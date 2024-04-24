ALTER TABLE paperWorksDocuments ADD `createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE paperWorksDocuments ADD `createdBy` text(150);--> statement-breakpoint
ALTER TABLE usersFiles ADD `createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE usersFiles ADD `createdBy` text(150);