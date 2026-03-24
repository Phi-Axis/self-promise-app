CREATE TABLE `promises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`promiseText` text NOT NULL,
	`status` enum('empty','active','checked','archived') NOT NULL DEFAULT 'empty',
	`reflectionText` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `promises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`notificationEnabled` boolean NOT NULL DEFAULT true,
	`notificationTime` varchar(5) NOT NULL DEFAULT '21:00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_userId_unique` UNIQUE(`userId`)
);
