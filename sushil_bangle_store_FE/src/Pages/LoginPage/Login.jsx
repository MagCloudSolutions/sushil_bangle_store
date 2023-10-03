import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { defaultToast, errorToast } from "../../Utils/Toast";
import { ToastContainer } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      if (email.trim() === process.env.REACT_APP_EMAIL && password.trim() === process.env.REACT_APP_PASSWORD) {
        localStorage.setItem("isAdmin", true);
        defaultToast("Welcome ADMIN");
        navigate("/");
      } else {
        const loginResp = await fetch("http://localhost:8000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const res = await loginResp.json();

        if (res.success) {
          defaultToast(`Welcome Back, ${res.response.fullName}`);
          localStorage.setItem("token", res.token);
          navigate("/");
        } else {
          errorToast("Error loggin in!");
        }
      }


    } catch (err) {
      console.log("Something went wrong", err);
      errorToast("Error loggin in!");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <div className="text-center my-5">
          <h1 className="mt-5" style={styles.text.h1}>
            Welcome Back
          </h1>
          <br />
          <h2 style={styles.text.h2}>Login to continue</h2>
        </div>
        <div className="form text-center">
          <form>
            <input
              className="my-2"
              style={styles.input}
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              className="my-2"
              style={styles.input}
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button
              type="submit"
              onClick={handleLogin}
              className="btn my-3"
              style={styles.btn}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const styles = {
  text: {
    h1: { color: "#670006", padding: 10 },
    h2: { color: "#e7e7e7", padding: 10 },
  },
  input: {
    width: 350,
    height: 50,
    border: "1px solid #670006",
    padding: 10,
    borderRadius: 10,
  },
  btn: {
    backgroundColor: "#670006",
    color: "#e7e7e7",
    width: 100,
  },
};

export default Login;