import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EmployeeInterface.module.css";
import { auth } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import Loading from "../Loading/Loading";
import Notification from "../Notifications/Notification";

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
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  // Helper function to remove notifications
  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const fetchOrderNumber = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/orderNumber`);
      setCurrentOrder(response.data.currentOrderNumber);
    } catch (error) {
      addNotification(error.message, "error");
    }
  };
  useEffect(() => {
    const notificationMessage = localStorage.getItem("logInNotification");
    if (notificationMessage) {
      addNotification(notificationMessage, "success");
      localStorage.removeItem("logInNotification");
    }
  }, []);

  const handleLogOut = async () => {
    addNotification("Logging out...", "info");
    try {
      await signOut(auth);
      addNotification("Logged out successfully", "success");
      localStorage.setItem("logoutNotification", "Logged out successfully");

      navigate("/login");
    } catch (err) {
      addNotification(err.message, "error");
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

  const handlePrintToken = async () => {
    setLoading(true);
    try {
      const employeeIDWithPrefix = employeeID;
      const checkResponse = await axios.get(
        `${apiUrl}/api/employee/check/${employeeIDWithPrefix}`
      );

      if (!checkResponse.data.exists) {
        addNotification("Invalid Employee ID", "error");
        setLoading(false);
        return;
      }

      await fetchOrderNumber();

      const timestamp = new Date();
      const orderData = {
        orderID: currentOrder,
        orderDate: timestamp.toLocaleDateString("en-CA"),
        orderTime: timestamp.toLocaleTimeString("en-US"),
        orderStatus: "Pending",
        EmpID: employeeID,
      };

      const orderResponse = await axios.post(`${apiUrl}/api/order`, orderData);
      addNotification("Order posted successfully", "success");

      const response = await axios.post(`${apiUrl}/api/orderNumber/increment`);
      setCurrentOrder(response.data.currentOrderNumber);
      addNotification("Order Placed Successfully", "success");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        addNotification("Invalid Employee ID", "error");
      } else {
        addNotification(error.message, "error");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.containerr}>
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
      <div className={styles.topDiv}>
        <div className={styles.title}>
          <div className={styles.titleUnWrap}>Lanka</div>
          <div className={styles.titleWrap}>Pharmacy</div>
        </div>
        <div className={styles.logoutBtn}>
          <button onClick={handleLogOut}>Logout</button>
        </div>
      </div>
      <div className={styles.secondDiv}>
        <div className={styles.genBox}>
          <div className={styles.boxTop}>
            Recent Order: #{currentOrder > 0 ? currentOrder - 1 : 0}
            <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#22c55e" }} />
          </div>
          <div className={styles.boxDes}>
            Enter your Employee ID to place an order and print the token.
          </div>
          <div className={styles.inputArea}>
            <div className={styles.inputData}>
              <FontAwesomeIcon icon={faUser} size="1x" color="#6b7280" />
              <div className={styles.inputBox}>
                <input
                  type="text"
                  id="employeeID"
                  ref={employeeIDRef}
                  value={employeeID}
                  onChange={(e) => setEmployeeID(e.target.value)}
                  placeholder="Enter Employee ID"
                />
              </div>
            </div>
          </div>
          <div className={styles.printBtn}>
            <button ref={printTokenButtonRef} onClick={handlePrintToken}>
              Print Token
            </button>
          </div>
        </div>
      </div>
      <div className={styles.foot}>Powered by Mavericks</div>
    </div>
  );
};

export default EmployeeInterface;
