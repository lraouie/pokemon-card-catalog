import { mysqlTable, serial, varchar, text, int, decimal } from "drizzle-orm/mysql-core";

export const pokemonCards = mysqlTable("pokemon_cards", {
  id: serial("id").primaryKey(),
  card_name: varchar("card_name", { length: 255 }).notNull(),
  card_description: text("card_description"),
  card_image: varchar("card_image", { length: 500 }),
  stocks: int("stocks").default(0),
  price: decimal("price", { precision: 10, scale: 2 }).default("0.00"),
});
