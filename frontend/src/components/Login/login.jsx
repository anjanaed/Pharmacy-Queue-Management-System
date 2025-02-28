import React, { useState, useEffect } from "react";
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

      <div className={styles["login-container"]}>
        <div className="text-center">
          <h2>
            Sign in to your account
          </h2>
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <div className={styles["email-container"]}>
              <label htmlFor="email">
                Email address
              </label>
              <div className={styles["input-container"]}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  onChange={(e) => setName(e.target.value)}
                  className={styles["email-input"]}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <div className={styles["Password-container"]}>
                <label htmlFor="password">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles["password-input"]}
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className={styles["login-button"]}
              >
                Login
              </button>
            </div>
            
          </form>
        </div>
        <div>
              <a href="#">
                Powered by Mavericks
              </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
