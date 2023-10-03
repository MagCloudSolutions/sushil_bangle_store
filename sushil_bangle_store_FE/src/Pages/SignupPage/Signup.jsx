import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { defaultToast, errorToast } from "../../Utils/Toast";
import { ToastContainer } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const signupResp = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email, password })
      });

      const res = await signupResp.json();

      if (res.success) {
        defaultToast(`Welcome, ${res.response.fullName}`);
        localStorage.setItem("token", res.token);
        navigate("/");
      } else {
        errorToast("Error Signing-up!");
      }
    } catch (err) {
      console.log("Something went wrong", err);
      errorToast("Error Signing-up!");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <div className="text-center my-5">
          <h1 className="mt-5" style={styles.text.h1}>
            Welcome
          </h1>
          <br />
          <h2 style={styles.text.h2}>Signup to continue</h2>
        </div>
        <div className="form text-center">
          <form>
            <input
              className="my-2"
              style={styles.input}
              type="text"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
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
              onClick={handleSignup}
              className="btn my-3"
              style={styles.btn}
            >
              Signup
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

export default Signup;
