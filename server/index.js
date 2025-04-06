import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import PpstcardModel from "./models/Postcards.js";
const app = express();

dotenv.config({ path: "./config.env" });

app.use(cors());
app.use(express.json());

connectDB(); // Database connection

app.post("/addpostcard", async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;

  const postcard = new postcardModel({
    name: name,
    description: description,
  });
  await postcard.save();
  res.send("Success");
});

app.get("/allpostcards", async (req, res) => {
  try {
    const result = await postcardModel.find({});
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log(`Server listening -> http://localhost:3001`);
});
