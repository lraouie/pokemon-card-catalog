import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cardsRouter from "./routes/cards.js";  // import routes

const app = express();
app.use(cors());
app.use(express.json());

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use the cards router
app.use("/api/cards", cardsRouter);

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
