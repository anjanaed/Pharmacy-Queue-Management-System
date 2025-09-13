import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore } from "../firebase";
import { useState } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./register.module.css"; // Import CSS module
import Loading from "../Loading/Loading";
import Notification from "../Notifications/Notification";

const Register = () => {
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };
  const apiUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;


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
        .post(`${apiUrl}/api/employee/`, data)
        .then(() =>{
          localStorage.setItem(
            "registerNotification",
            "User Registered Successfully!"
          )
          navigate("/employees");}
        )
        .catch((err) => addNotification(err.response.data.message,'error'));

      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.notificationContainer}>
        {notifications.map(({ id, message, type }) => (
          <Notification
            key={id}
            message={message}
            type={type}
            onClose={() => removeNotification(id)}
          />
        ))}
      </div>
      <div className={`row g-0 ${styles.loginContainer}`}>
        {/* Left Side */}
        <div
          className={`col-md-6 ${styles.leftSide}`}
        >
          <img
            src="/img/logo.png"
            alt="Logo"
            className={styles.leftImage}
          />
          <img
            src="/img/pills.png"
            alt="Pills"
            className={styles.rightImage}
          />
        </div>
        {/* Right Side */}
        <div
          className={`col-md-6 ${styles.rightSide}`}
        >
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate('/employees')}
          >
            ◀ Back
          </button>
          <h3 className={styles.registerHeading}>
            Employee Registration
          </h3>
          <form onSubmit={handleRegister} className={styles.formContainer}>
            <div className="mb-3">
              <label
                htmlFor="id"
                className={styles.smallerText}
              >
                Employee ID
              </label>
              <input
                onChange={(e) => setId(e.target.value)}
                className={styles.textBoxSmall}
                placeholder="Enter Employee ID"
                type="text"
                id="id"
                name="id"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="name"
                className={styles.smallerText}
              >
                Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                className={styles.textBoxSmall}
                placeholder="Enter Full Name"
                type="text"
                id="name"
                name="name"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="email"
                className={styles.smallerText}
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className={styles.textBoxSmall}
                placeholder="Enter Email Address"
                type="email"
                id="email"
                name="email"
              />
            </div>
            <button type="submit" className={styles.customButton}>
              Register Employee
            </button>
          </form>
        </div>
      </div>
      
    </div>
    
  );
};

export default Register;
