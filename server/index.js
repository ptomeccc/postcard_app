import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import PostcardModel from "./models/Postcards.js";

dotenv.config({ path: "./secret.env" });

const app = express();
app.use(cors());
app.use(express.json());

connectDB(); // Database connection

app.get("/insert", async (req, res) => {
  const postcard = new PostcardModel({
    name: "Łódź - najpiękniejsze miasto w Polsce",
    description: "Pocztówka z Łodzi, najpiękniejszego miasta w Polsce.",
  });
  await postcard.save();
  res.send("Inserted new Data");
});

app.listen(3001, () => {
  console.log(`Server listening -> http://localhost:3001`);
});
