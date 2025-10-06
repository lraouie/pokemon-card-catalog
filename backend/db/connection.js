// Promise support for asynchronous database operations
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

// pool allows multiple connections to the MySQL database
const pool = mysql.createPool({
  host: "localhost",              
  user: "root",                  
  password: "TakeHomeProject12345!",
  database: "pokemon_catalog",  
});

// Initialize Drizzle ORM with the MySQL connection pool
// This allows to run database queries using Drizzle instead of raw SQL
export const db = drizzle(pool);
