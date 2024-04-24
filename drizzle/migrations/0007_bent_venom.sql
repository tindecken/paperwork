DROP TABLE `paperWorksDocuments`;--> statement-breakpoint
ALTER TABLE documents ADD `paperWorkId` integer NOT NULL REFERENCES paperWorks(id);--> statement-breakpoint
ALTER TABLE paperWorks ADD `date` text;--> statement-breakpoint
ALTER TABLE paperWorks ADD `price` text;--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/