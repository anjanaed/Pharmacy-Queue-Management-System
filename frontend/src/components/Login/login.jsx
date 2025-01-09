import React, { useState,useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './login.module.css';
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import Notification from '../Notifications/Notification';

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };
  useEffect(() => {
    const notificationMessage = localStorage.getItem('logoutNotification');
    if (notificationMessage) {
      addNotification(notificationMessage, 'success');
      localStorage.removeItem('logoutNotification');
    }
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !password) {
      addNotification('Please fill in all fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, name, password);
      localStorage.setItem('logInNotification', 'Successfully logged in!');
      navigate("/");
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          addNotification('Invalid email format', 'error');
          break;
        case 'auth/user-not-found':
          addNotification('No user found with this email', 'error');
          break;
        case 'auth/wrong-password':
          addNotification('Incorrect password', 'error');
          break;
        case 'auth/too-many-requests':
          addNotification('Too many attempts. Please try again later', 'error');
          break;
        default:
          addNotification('Login failed. Please try again', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles['login-wrapper']}>
      {/* Notification Stack */}
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

      <div className={`row g-0 ${styles['login-container']}`}>
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