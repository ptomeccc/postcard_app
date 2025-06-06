import express from "express";
import verifyJWT from "../Middlewares/verifyJWT.js";
import {
  addPostcard,
  deletePostcard,
  editPostcard,
} from "../Controllers/PostcardController.js";

const router = express.Router();

router.post("/folder/:id/add_postcard", verifyJWT, addPostcard);
router.delete("/postcard/:id", verifyJWT, deletePostcard);
router.put("/postcard/:id", verifyJWT, editPostcard);

export default router;
