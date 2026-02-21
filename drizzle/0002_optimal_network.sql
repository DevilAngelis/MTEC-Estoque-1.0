ALTER TABLE `categories` DROP INDEX `categories_name_unique`;--> statement-breakpoint
ALTER TABLE `materials` MODIFY COLUMN `categoryId` int;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `openId` varchar(64);--> statement-breakpoint
ALTER TABLE `categories` ADD `userId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `materials` ADD `userId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `materials` ADD `code` varchar(100);--> statement-breakpoint
ALTER TABLE `movements` ADD `userId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` varchar(255);