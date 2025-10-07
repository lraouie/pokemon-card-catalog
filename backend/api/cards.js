import mysql from "mysql2/promise";

export default async function handler(req, res) {
  try {
    // Connect to your MySQL or PlanetScale database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,      // e.g. "aws.connect.psdb.cloud"
      user: process.env.DB_USER,      // your username
      password: process.env.DB_PASS,  // your password
      database: process.env.DB_NAME,  // your database name
      ssl: { rejectUnauthorized: true } // important for PlanetScale
    });

    // Query example
    const [rows] = await connection.execute("SELECT * FROM cards");

    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database connection failed", error });
  }
}
