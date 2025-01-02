import React, { useState, useEffect } from 'react';
import Header from "../Header"; // Adjust the import path as needed
import './order_history.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  useEffect(() => {
    // Fetch orders from an API or define them statically
    const fetchOrders = async () => {
      // Example static orders
      const fetchedOrders = [
        { id: 1, order: 'Order 1', number: '123', employeeId: 'EMP001', time: '10:00 AM' },
        { id: 2, order: 'Order 2', number: '456', employeeId: 'EMP002', time: '11:00 AM' },
        // Add more orders as needed
      ];
      setOrders(fetchedOrders);
    };

    fetchOrders();
  }, []);

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      <Header />
      <main>
        <header className="main-content">
          <h1>Order History</h1>
        </header>
        <div className="content">
          <table>
            <thead>
              <tr>
                <th className="table-raw">Number</th>
                <th className="table-raw">Order</th>
                <th className="table-raw">Employee ID</th>
                <th className="table-raw">Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.order}</td>
                  <td>{order.employeeId}</td>
                  <td>{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
