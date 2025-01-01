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
        { id: 1, status: 'Pending Order Number', orderNumber: 'ORD001' },
        { id: 2, status: 'Pending Order Number', orderNumber: 'ORD002' },
        // Add more orders as needed
      ];
      setOrders(fetchedOrders);
    };

    fetchOrders();
  }, []);

  const handleConfirm = (orderId) => {
    // Define the logic for confirming an order
    console.log(`Order ${orderId} confirmed`);
  };

  const handleCancel = (orderId) => {
    // Define the logic for canceling an order
    console.log(`Order ${orderId} canceled`);
  };

  return (
    <div className="container">
      <Header />
      <main>
        <header className="main-content">
          <h1>Pending Orders</h1>
        </header>
        <div className="content">
          <table>
            <thead>
              <tr>
                <th className="table-raw">Number</th>
                <th className="table-raw">Status</th>
                <th className="table-raw">Pending Order Number</th>
                <th className="table-raw">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.status}</td>
                  <td>{order.orderNumber}</td>
                  <td>
                    <button onClick={() => handleCancel(order.id)} className='Cancel'>Cancel</button>
                    <button onClick={() => handleConfirm(order.id)} className='Confirm'>Confirm</button> 
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
