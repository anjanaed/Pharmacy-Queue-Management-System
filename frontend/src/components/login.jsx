import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("user logged in");
      window.location.href = "/user";
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <br />
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email"
          name="email"
        />
        <br />
        <label htmlFor="pass">Password:</label>
        <br />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="pass"
          name="pass"
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default Login;
