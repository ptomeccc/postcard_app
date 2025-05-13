// src/Layout.jsx
import Navbar from "./components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const Layout = () => {
  const { username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <Navbar username={username} onLogout={handleLogout} />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
