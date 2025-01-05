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
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    SpeechUtil.initialize(
      // onStart callback
      () => {
        setIsPlaying(true);
        setNotification("Order is Calling...");
        
      },
      // onEnd callback
      () => {
        setIsPlaying(false);
        setNotification(null)
      }
    );
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3000/api/order");

      const fetchedOrders = response.data
        .filter((order) => order.orderStatus == "Pending")
        .map((order) => ({
          id: order.orderID,
          date: order.orderDate,
          empId: order.EmpID,
        }));
      setOrders(fetchedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
      await axios
        .put(`http://127.0.0.1:3000/api/order/${orderId}/${orderDate}`, {
          orderStatus: "Completed",
        })
        .then((res) => {
          console.log(res);
          console.log("Order Completed");
          fetchOrders();
        });
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handleCancel = async (orderId, orderDate) => {
    try {
      await axios
        .put(`http://127.0.0.1:3000/api/order/${orderId}/${orderDate}`, {
          orderStatus: "Cancelled",
        })
        .then((res) => {
          console.log(res);
          console.log("Order Cancelled");
          fetchOrders();
        });
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const handleModalConfirm = () => {
    setOrders(orders.filter((order) => order.id !== currentOrderId));
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleBoxClick = (orderId) => {
    // Prevent multiple audio plays at once
    if (!isPlaying) {
      SpeechUtil.speak(`${orderId} can be collected from the counter`);
    }
  };

  return (
    <div className={styles.full}>
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <div className={styles["left-div"]}>
        <Header />
      </div>
      <div className={styles["right-div"]}>
        <div className={styles.conPed}>
          <div className={styles.title}>
            <h1>Pending Orders</h1>
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
                        color="red"
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