import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql", 
  schema: "./src/db/schema.ts", 
  out: "./drizzle", 
  dbCredentials: {
    host: "localhost",      
    user: "root",
    password: "TakeHomeProject12345!",
    database: "pokemon_catalog",
  },
});
