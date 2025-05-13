import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { setUsername } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/login",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        const userRes = await axios.get("http://localhost:4000/auth/user", {
          withCredentials: true,
        });
        setUsername(userRes.data.username);
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };

  return (
    <div className="form_container">
      <h2>Zaloguj się</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Wpisz swój email"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Hasło</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Wpisz swoje hasło"
            onChange={handleOnChange}
          />
        </div>
        <button type="submit">Zatwierdź</button>
        <span>
          Masz już konto? <Link to={"/signup"}>Zarejestruj się</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
