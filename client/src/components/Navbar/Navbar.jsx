import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ username, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="link-section">
        <ul className="navbar-links">
          <li>
            <Link to="/">Strona główna</Link>
          </li>
          {username ? (
            <li>
              <Link to="/folders">Foldery</Link>
            </li>
          ) : (
            <></>
          )}
        </ul>
      </div>
      <div className="login-section">
        <ul className="navbar-links">
          {username ? (
            <>
              <li>
                <span>{username}</span>
              </li>
              <li>
                <button onClick={onLogout}>Wyloguj</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Logowanie</Link>
              </li>
              <li>
                <Link to="/signup">Rejestracja</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
