import express from "express";
import {
  createFolder,
  getAllFolders,
  getFolderById,
  deleteFolder,
  editFolder,
} from "../Controllers/FolderController.js";
import verifyJWT from "../Middlewares/verifyJWT.js";

const router = express.Router();

router.post("/createfolder", verifyJWT, createFolder);
router.get("/folders", verifyJWT, getAllFolders);
router.get("/folder/:id", verifyJWT, getFolderById);
router.delete("/folder/:id", verifyJWT, deleteFolder);
router.put("/editfolder", verifyJWT, editFolder);

export default router;
