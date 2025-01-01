import React, { useState, useEffect } from 'react';
import Header from "../Header"; // Adjust the import path as needed
import './Pending_Order.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const PendingOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from an API or define them statically
    const fetchOrders = async () => {
      // Example static orders
      const fetchedOrders = [
        { id: 1, orderNumber: 'ORD001' },
        { id: 2, orderNumber: 'ORD002' },
        // Add more orders as needed
      ];
      setOrders(fetchedOrders);
    };

    fetchOrders();
  }, []);

  const addEmployee = () => {
    // Define the addEmployee function logic
  };

  return (
    <div className="container">
      <Header />
      <main>
        <header className="main-content">
          <h1>Pending Orders</h1>
        </header>
        <div className="content">
          <div className="new">
            <button className="add-new" onClick={addEmployee}>+ Add New</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Pending Order Number</th>
                <th>Order Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.orderNumber}</td>
                  <td>
                    {/* Add your action buttons or links here */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default PendingOrder;
