import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore } from "../firebase";
import { useState } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./register.module.css"; // Import CSS module
import Loading from "../Loading/Loading";

const Register = () => {
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const data = {
        empID: id,
        name: name,
        email: email,
      };
      axios
        .post("http://localhost:3000/api/employee/", data)
        .then((result) => console.log(result))
        .catch((err) => console.log(err));

      console.log("User Registered");
      setLoading(false);
      navigate("/employees");
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  if (loading){
    return <Loading/>
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={`row g-0 ${styles.loginContainer}`}>
        {/* Left Side */}
        <div
          className={`col-md-6 ${styles.leftSide} d-flex flex-column justify-content-center align-items-center`}
        >
          <img
            src="public/img/logo.png"
            alt="Logo"
            className={styles.leftImage}
          />
          <img
            src="public/img/pills.png"
            alt="Pills"
            className={styles.rightImage}
          />
        </div>
        {/* Right Side */}
        <div
          className={`${styles.rightSide} d-flex flex-column justify-content-center`}
        >
          <h3 className={`text-center ${styles.registerHeading}`}>
            PharmacyLanka
          </h3>
          <form onSubmit={handleRegister} className={styles.formContainer}>
            <div className="mb-3 position-relative">
              <label
                htmlFor="id"
                className={`form-label ${styles.smallerText}`}
              >
                Employee ID
              </label>
              <input
                onChange={(e) => setId(e.target.value)}
                className={`form-control form-control-lg ${styles.textBoxSmall} ps-2`}
                placeholder="Enter your ID"
                type="id"
                id="id"
                name="id"
              />
            </div>
            <div className="mb-3 position-relative">
              <label
                htmlFor="name"
                className={`form-label ${styles.smallerText}`}
              >
                Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                className={`form-control form-control-lg ${styles.textBoxSmall} ps-2`}
                placeholder="Enter your Name"
                type="name"
                id="name"
                name="name"
              />
            </div>
            <div className="mb-3 position-relative">
              <label
                htmlFor="pass"
                className={`form-label ${styles.smallerText}`}
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className={`form-control form-control-lg ${styles.textBoxSmall} ps-2`}
                placeholder="Enter your Email"
                type="email"
                id="email"
                name="email"
              />
            </div>
            <button type="submit" className={styles.customButton}>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
