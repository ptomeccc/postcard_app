import User from "../Models/User.js";
import createSecretToken from "../util/SecretToken.js";
import bcrypt from "bcrypt";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ username, email, password });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in succesfully", success: true, user });
    next();
  } catch (error) {
    console.log(error);
  }
};
