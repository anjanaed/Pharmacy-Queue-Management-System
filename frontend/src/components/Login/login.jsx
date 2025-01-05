import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './login.module.css';  // Importing the CSS Module

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, name, password);
      console.log("User logged in");
      window.location.href = "/";
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className={styles['login-wrapper']}>
      <div className={`row g-0 ${styles['login-container']}`}>
        {/* Left Side */}
        <div className={`col-md-6 ${styles['left-side']} `}>
          <img
            src="public/img/logo.png"
            alt="Logo"
            className={styles['left-image']}
          />
          <img
            src="public/img/pills.png"
            alt="Pills"
            className={styles['right-image']}
          />
        </div>

        {/* Right Side */}
        <div className={styles['right-side']}>
          <h3 className={`text-center mb-3 ${styles['welcome-heading']}`}>Hello! Welcome Back</h3>
          <h3 className={`text-center ${styles['register-heading']}`}>PharmacyLanka</h3>
          <form onSubmit={handleSubmit} className={styles['form-container']}>
            <div className="mb-3 position-relative">
              <label htmlFor="name" className={`form-label ${styles['smaller-text']}`}>User Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                className={`form-control form-control-lg ${styles['text-box-small']} ps-2`}
                placeholder="Enter Username"
                type="name"
                id="name"
                name="name"
              />
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="pass" className={` ${styles['smaller-text']}`}>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                className={`form-control form-control-lg ${styles['text-box-small']} ps-2`}
                placeholder="Enter your Password"
                type="password"
                id="password"
                name="password"
              />
            </div>
            <button type="submit" className={styles['custom-button']}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
