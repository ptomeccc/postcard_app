import {
  SignUp,
  Login,
  Logout,
  UserInfo,
} from "../Controllers/AuthController.js";
import express from "express";
import verifyJWT from "../Middlewares/verifyJWT.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/logout", verifyJWT, Logout);
router.get("/auth/user", verifyJWT, UserInfo);

export default router;
