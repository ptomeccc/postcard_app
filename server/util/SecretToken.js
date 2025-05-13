import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({ path: "./config/config.env" });

const createSecretToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export default createSecretToken;
