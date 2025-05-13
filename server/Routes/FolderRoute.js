import express from "express";
import {
  createFolder,
  getAllFolders,
  getFolderById,
} from "../Controllers/FolderController.js";
import verifyJWT from "../Middlewares/verifyJWT.js";

const router = express.Router();

router.post("/createfolder", verifyJWT, createFolder);
router.get("/folders", verifyJWT, getAllFolders);
router.get("/folder/:id", verifyJWT, getFolderById);

export default router;
