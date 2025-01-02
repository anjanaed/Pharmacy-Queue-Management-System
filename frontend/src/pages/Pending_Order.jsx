import React, { useState, useEffect } from 'react';
import Header from "../Header"; // Adjust the import path as needed
import './Pending_Order.css';

const PendingOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

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
    setCurrentOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCancel = (orderId) => {
    // Define the logic for canceling an order
    console.log(`Order ${orderId} canceled`);
  };

  const handleModalConfirm = () => {
    // Define the logic for confirming an order
    console.log(`Order ${currentOrderId} confirmed`);
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      <Header />
      <main>
        <header className="main-content">
          <h1>Pending Orders</h1>
        </header>
        <div className="content">
          <div className='main_box'>
            {orders.map((order) => (
              <div className='box' key={order.id}>
                <h3 className='box-title'>{order.status}</h3>
                <p className='order-number'>{order.orderNumber}</p>
                <div className='button-container'>
                  <button className="cancel" onClick={() => handleCancel(order.id)}>Cancel</button>
                  <button className="confirm" onClick={() => handleConfirm(order.id)}>Confirm</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalCancel}>&times;</span>
            <h2>Confirm Order</h2>
            <p>Are you sure you want to confirm this order?</p>
            <div className="button-container">
              <button onClick={handleModalCancel} className="Cancel">Cancel</button>
              <button onClick={handleModalConfirm} className="Confirm">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingOrder;
