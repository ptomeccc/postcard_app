import jwt from "jsonwebtoken";
import User from "../Models/User.js";

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Brak tokena, autoryzacja odrzucona." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika." });
    }

    req.username = user.username;

    next();
  } catch (error) {
    console.error("authenticateToken: Błąd weryfikacji tokena:", error);
    return res.status(403).json({ message: "Nieprawidłowy token" });
  }
};

export default authenticateToken;
