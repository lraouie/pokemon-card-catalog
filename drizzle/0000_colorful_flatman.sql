CREATE TABLE `pokemon_cards` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`card_name` varchar(255) NOT NULL,
	`card_description` text,
	`card_image` varchar(500),
	`stocks` int DEFAULT 0,
	`price` decimal(10,2) DEFAULT '0.00',
	`date_added` datetime DEFAULT '2025-10-03 17:03:37.451',
	CONSTRAINT `pokemon_cards_id` PRIMARY KEY(`id`)
);
