import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { email, password, username } = inputValue;
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
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/signup",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
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
      username: "",
    });
  };

  return (
    <div className="form_container">
      <h2>Załóż Konto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Wprowadź swój email"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="email">Nazwa Użytkownika</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Wprowadź swoją nazwę użytkownika"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Hasło</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Wprowadź swoje hasło"
            onChange={handleOnChange}
          />
        </div>
        <button type="submit">Zatwierdź</button>
        <span>
          Masz już konto? <Link to={"/login"}>Zaloguj się</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;
