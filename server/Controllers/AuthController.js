import User from "../Models/User.js";
import createSecretToken from "../util/SecretToken.js";
import bcrypt from "bcrypt";

export const SignUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Walidacja hasła
    const passwordStrength = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });

    // Walidacja nazwy użytkownika, żeby nie była pusta ani nie zawierała spacji
    if (!username || username.trim() === "" || /\s/.test(username)) {
    }

    if (!passwordStrength) {
    }

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

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, { withCredentials: true, httpOnly: false });
    res
      .status(201)
      .json({ message: "User logged in successfully", success: true });
    next();
  } catch (error) {
    console.error(error);
  }
};

export const Logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
    });
    return res
      .status(200)
      .json({ success: true, message: "Wylogowano pomyślnie" });
  } catch (error) {
    next(error);
  }
};

export const UserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Błąd serwera" });
  }
};
