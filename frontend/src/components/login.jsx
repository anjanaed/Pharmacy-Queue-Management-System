import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in");
      window.location.href = "/user";
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="row g-0 login-container">
        {/* Left Side */}
        <div className="col-md-6 left-side d-flex flex-column justify-content-center align-items-center">
          <img
            src="public/img/logo.png"
            alt="Logo"
            className="right-image"
          />
          <img
            src="public/img/pills.png"
            alt="Pills"
            className="left-image"
          />
        </div>
        {/* Right Side */}
        <div className="col-md-6 right-side d-flex flex-column justify-content-center">
        <h3 className="text-center mb-3 display-5 welcome-heading">Hello! Welcome Back</h3>
        <h1 className="pharmacy-heading">Pharmacy Lanka</h1>

          <form onSubmit={handleSubmit} className="form-container" >
            <div className="mb-3 position-relative">
              {/* <i className="bi bi-person position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i> */}
              <label htmlFor="email" className="form-label larger-text">Email</label>
              <input
                type="email"
                id="email"
                className="form-control form-control-lg text-box-large ps-5"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 position-relative">
              {/* <i className="bi bi-lock position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i> */}
              <label htmlFor="password" className="form-label larger-text">Password</label>
              <input
                type="password"
                id="password"
                className="form-control form-control-lg text-box-large ps-5"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-check mb-3 d-flex align-items-center checkbox">
              <input
                type="checkbox"
                id="remember"
                className="form-check-input checkbox-large"
              />
              <label htmlFor="remember" className="form-check-label larger-text ms-2">
                Remember me
              </label>
            </div>
            <button 
  type="submit" 
  className="btn btn-lg w-100 custom-button"
>
  Login
</button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;


