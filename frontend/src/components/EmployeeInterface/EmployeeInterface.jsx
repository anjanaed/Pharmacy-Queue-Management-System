import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EmployeeInterface.module.css";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Loading from "../Loading/Loading";
import Notification from '../Notifications/Notification';

const EmployeeInterface = () => {
  const navigate = useNavigate();
  const [employeeID, setEmployeeID] = useState("");
  const [currentOrder, setCurrentOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeMenu, setActiveMenu] = useState("generateToken");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  const employeeIDRef = useRef(null);
  const printTokenButtonRef = useRef(null);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;


  // Helper function to add notifications
  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  // Helper function to remove notifications
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };



  const fetchOrderNumber = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/orderNumber`);
      setCurrentOrder(response.data.currentOrderNumber);
    } catch (error) {
      addNotification(error.message, 'error');
    }
  };
    useEffect(() => {
      const notificationMessage = localStorage.getItem('logInNotification');
      if (notificationMessage) {
        addNotification(notificationMessage, 'success');
        localStorage.removeItem('logInNotification');
      }
    }, []);

  const handleLogOut = async () => {
    addNotification("Logging out...", 'info');
    try {
      await signOut(auth);
      addNotification("Logged out successfully", 'success');
      localStorage.setItem('logoutNotification', 'Logged out successfully');

      navigate('/login');
    } catch (err) {
      addNotification(err.message, 'error');
    }
  };

  useEffect(() => {
    fetchOrderNumber();
    const interval = setInterval(fetchOrderNumber, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        printTokenButtonRef.current.click();
      } else {
        employeeIDRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const incrementOrderNumber = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/api/orderNumber/increment`);
      await fetchOrderNumber();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintToken = async () => {
    try {
      setLoading(true);
      const employeeIDWithPrefix = employeeID;
      const checkResponse = await axios.get(
        `${apiUrl}/api/employee/check/${employeeIDWithPrefix}`
      );

      if (!checkResponse.data.exists) {
        addNotification("Invalid Employee ID", 'error');
        return;
      }

      await fetchOrderNumber();

      const timestamp = new Date();
      const orderData = {
        orderID: currentOrder,
        orderDate: timestamp.toLocaleDateString("en-CA"),
        orderTime: timestamp.toLocaleTimeString("en-US"),
        orderStatus: "Pending",
        EmpID: employeeID
      };


      await axios.post(`${apiUrl}/api/order`, orderData);
      addNotification("Order posted successfully", 'success');

      await incrementOrderNumber();
      addNotification("Order Placed Successfully", 'success');
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        addNotification("Invalid Employee ID", 'error');
      } else {
        addNotification(error.message, 'error');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }


  return (
    <div className={styles.container}>
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

      <button className={styles.logout} onClick={handleLogOut}>Logout</button>
      <main className={styles.content}>
        {activeMenu === "generateToken" && (
          <section className={styles['generate-token']}>
            <div className={styles['token-generator']}>
              <div className={styles.details}>
                <p>
                  Recent Order Number: <strong>{currentOrder-1}</strong>
                </p>
              </div>
              
              <div className={styles['token-box']}>
                <header className={styles.header}>
                  Generate Token
                </header>
                <div className={styles['employee-code']}>
                  <label htmlFor="employeeID">Employee ID:</label>
                  <input
                    type="text"
                    id="employeeID"
                    ref={employeeIDRef}
                    value={employeeID}
                    onChange={(e) => setEmployeeID(e.target.value)}
                  />
                </div>
                <button 
                  className={styles['primary-btn']} 
                  ref={printTokenButtonRef} 
                  onClick={handlePrintToken}
                >
                  Print Token
                </button>
                <div>
                  <p>
                    <strong>
                      {currentDateTime.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      {currentDateTime.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: true,
                      })}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default EmployeeInterface;