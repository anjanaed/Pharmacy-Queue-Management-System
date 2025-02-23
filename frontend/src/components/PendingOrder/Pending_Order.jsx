import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import styles from "./Pending_Order.module.css";
import axios from "axios";
import { IoMdCloseCircle } from "react-icons/io";
import Loading from "../Loading/Loading";
import SpeechUtil from "./Speech";
import Notification from '../Notifications/Notification';

const PendingOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };
  const apiUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;


  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  useEffect(() => {
    const notificationMessage = localStorage.getItem('logInNotification');
    if (notificationMessage) {
      addNotification(notificationMessage, 'success');
      localStorage.removeItem('logInNotification');
    }
  }, []);

  useEffect(() => {
    SpeechUtil.initialize(
      () => {
        setIsPlaying(true);
        addNotification("Order is being called...", 'info');
      },
      () => {
        setIsPlaying(false);
        // Don't remove notification here as it will be handled by the timeout in the Notification component
      }
    );
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/order`);
      const fetchedOrders = response.data
        .filter((order) => order.orderStatus === "Pending")
        .map((order) => ({
          id: order.orderID,
          date: order.orderDate,
          empId: order.EmpID,
        }));
      setOrders(fetchedOrders);
      setLoading(false);
    } catch (error) {
      addNotification(`Error fetching orders: ${error.message}`, 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleConfirm = async (orderId, orderDate) => {
    try {
      await axios.put(`${apiUrl}/api/order/${orderId}/${orderDate}`, {
        orderStatus: "Completed",
      });
      addNotification(`Order ${orderId} completed successfully`, 'success');
      fetchOrders();
    } catch (error) {
      addNotification(`Error confirming order: ${error.message}`, 'error');
    }
  };

  const handleCancel = async (orderId, orderDate) => {
    try {
      await axios.put(`${apiUrl}/api/order/${orderId}/${orderDate}`, {
        orderStatus: "Cancelled",
      });
      addNotification(`Order ${orderId} cancelled successfully`, 'success');
      fetchOrders();
    } catch (error) {
      addNotification(`Error cancelling order: ${error.message}`, 'error');
    }
  };

  const handleModalConfirm = () => {
    setOrders(orders.filter((order) => order.id !== currentOrderId));
    setIsModalOpen(false);
    addNotification("Order confirmed", 'success');
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleBoxClick = (orderId) => {
    if (!isPlaying) {
      SpeechUtil.speak(`${orderId} can be collected from the counter`);
      // addNotification(`Calling Order ${orderId}`);
    } else {
      addNotification("Please wait for the current announcement to finish", 'info');
    }
  };

  return (
    <div className={styles.full}>
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

      <div className={styles["left-div"]}>
        <Header />
      </div>
      <div className={styles["right-div"]}>
        <div className={styles.conPed}>
          <div className={styles.title}>
            <h1><strong>Pending Orders</strong></h1>
          </div>
          <div className={styles["order-contain"]}>
            <div className={styles["main-box"]}>
              {orders.length === 0 ? (
                <div className={styles.empty}>No Pending Orders</div>
              ) : (
                orders.map((order) => (
                  <div 
                    className={`${styles.box} ${isPlaying ? styles.disabled : ''}`}
                    key={order.id}
                    onClick={() => handleBoxClick(order.id)}
                    style={{ cursor: isPlaying ? 'not-allowed' : 'pointer' }}
                  >
                    <div className={styles.top}>
                      <p className={styles.emp}>Emp - {order.empId}</p>
                      <IoMdCloseCircle
                        color="#1255ff"
                        className={styles["close-icon"]}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel(order.id, order.date);
                        }}
                      />
                    </div>
                    <h3 className={styles["box-title"]}>Order</h3>
                    <p className={styles["order-number"]}>{order.id}</p>
                    <div className={styles["button-container"]}>
                      <button
                        className={styles["confirm-btn"]}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirm(order.id, order.date);
                        }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {isModalOpen && (
            <div className={styles.modal}>
              <div className={styles["modal-content"]}>
                <span className={styles.close} onClick={handleModalCancel}>
                  &times;
                </span>
                <h2>Confirm Order</h2>
                <p>Are you sure you want to confirm this order?</p>
                <div className={styles["button-container"]}>
                  <button onClick={handleModalCancel} className={styles.Cancel}>
                    Cancel
                  </button>
                  <button onClick={handleModalConfirm} className={styles.Confirm}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingOrder;