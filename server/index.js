import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoute from "./Routes/AuthRoute.js";
import folderRoute from "./Routes/FolderRoute.js";
import PostcardRoute from "./Routes/PostcardRoute.js";

const app = express();

dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT || 4000;

connectDB(); // Database connection

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/", authRoute);
app.use("/", folderRoute);
app.use("/", PostcardRoute);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
