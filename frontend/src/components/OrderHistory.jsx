import React, { useState, useEffect } from 'react';
import Header from "../Header"; // Adjust the import path as needed
import styles from './order_history.module.css';
import axios from 'axios';
import {format} from 'date-fns'

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);




  const fetchOrders = async () => {
    try{
    const response = await axios.get("http://127.0.0.1:3000/api/order");
    console.log(response)
    const fetchedOrders = response.data.filter((order) => order.orderStatus == "Completed").map((order)=>{
      const datee = new Date(order.orderDate);
      const formattedDate = format(datee,'yyyy-MM-dd'); // Format as YYYY-MM-DD
      console.log(formattedDate)
      return {
        id: order.orderID,
        emp: order.EmpID,
        date: formattedDate,
        time: order.orderTime,
        stat: order.orderStatus,
      };
    })
    
    setOrders(fetchedOrders);
  }catch(err){
    console.log(err)
  } 
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.full}>
      <div className={styles.leftDiv}>
      <Header />
      </div>
      <div className={styles.rightDiv}>
        <header className={styles.title}>
          <h1>Order History</h1>
        </header>
        <div className={styles.content}>
          <table>
            <thead>
              <tr>
                <th className={styles["table-raw"]}>#</th>
                <th className={styles["table-raw"]}>Order ID</th>
                <th className={styles["table-raw"]}>Employee ID</th>
                <th className={styles["table-raw"]}>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>#{index + 1}</td>
                  <td>{order.id}</td>
                  <td>{order.emp}</td>
                  <td>{order.date} | {order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
