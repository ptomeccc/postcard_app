import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:4000/auth/user", {
        withCredentials: true,
      });
      setUsername(res.data.username);
    } catch (err) {
      setUsername("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/logout",
        {},
        { withCredentials: true }
      );
      setUsername("");
    } catch (err) {
      console.error("Błąd wylogowania:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ username, setUsername, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
