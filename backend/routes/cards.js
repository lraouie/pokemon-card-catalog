import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { db } from "../db/connection.js";
import { pokemonCards } from "../db/schema.ts";
import { eq } from "drizzle-orm";

const router = express.Router();

// Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make uploads folder if not exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // unique filename
  },
});
const upload = multer({ storage });


// GET all cards
router.get("/", async (req, res) => {
  const cards = await db.select().from(pokemonCards);
  res.json(cards);
});

// POST add new card (with image)
router.post("/", upload.single("card_image"), async (req, res) => {
  console.log("Uploaded file:", req.file); 
  console.log("Body:", req.body);

  const { card_name, card_description, stocks, price } = req.body;
  const card_image = req.file ? `/uploads/${req.file.filename}` : null;

  const result = await db.insert(pokemonCards).values({
    card_name,
    card_description,
    stocks: parseInt(stocks),
    price: parseFloat(price),
    card_image,
  });

  res.json(result);
});

// PUT update card
router.put("/:id", upload.single("card_image"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { card_name, card_description, stocks, price } = req.body;

  let updateData = {
    card_name,
    card_description,
    stocks: parseInt(stocks),
    price: parseFloat(price),
  };

  if (req.file) updateData.card_image = `/uploads/${req.file.filename}`;

  await db.update(pokemonCards).set(updateData).where(eq(pokemonCards.id, id));
  res.json({ success: true });
});

// DELETE card
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const card = await db.select().from(pokemonCards).where(eq(pokemonCards.id, id));
  if (card[0]?.card_image) {
    const imgPath = path.join(__dirname, "../", card[0].card_image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }

  await db.delete(pokemonCards).where(eq(pokemonCards.id, id));
  res.json({ success: true });
});


export default router;
