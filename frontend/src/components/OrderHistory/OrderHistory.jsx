import React, { useState, useEffect } from 'react';
import Header from "../Header/Header";
import styles from './order_history.module.css';
import axios from 'axios';
import { format } from 'date-fns';
import Loading from '../Loading/Loading';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Notification from '../Notifications/Notification';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const apiUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;


  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const fetchOrders = async () => {
    try {
      // Fetch orders
      const ordersResponse = await axios.get(`${apiUrl}/api/order`);
      const fetchedOrders = ordersResponse.data
        .filter((order) => order.orderStatus === "Completed")
        .map((order) => {
          const datee = new Date(order.orderDate);
          const formattedDate = format(datee, 'yyyy-MM-dd');
          return {
            id: order.orderID,
            empId: order.EmpID,
            date: formattedDate,
            time: order.orderTime,
            stat: order.orderStatus,
          };
        });

      // Fetch employees
      const employeesResponse = await axios.get(`${apiUrl}/api/employee`);
      const employees = employeesResponse.data;

      // Create a mapping of employee IDs to employee names
      const employeeMap = employees.reduce((map, employee) => {
        map[employee.empID] = employee.name;
        return map;
      }, {});

      // Map employee names to orders
      const ordersWithEmployeeNames = fetchedOrders.map((order) => ({
        ...order,
        empName: employeeMap[order.empId] || 'Unknown',
      }));

      setOrders(ordersWithEmployeeNames);
    } catch (err) {
      addNotification(`Error loading data: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleDownloadClick = () => {
    setShowModal(true);
    addNotification("Please select date range for the report", 'info');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDownloadHistory = () => {
    if (!startDate || !endDate) {
      addNotification("Please select both start and end dates", 'error');
      return;
    }

    if (endDate < startDate) {
      addNotification("End date cannot be earlier than start date", 'error');
      return;
    }

    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
    });

    if (filteredOrders.length === 0) {
      addNotification("No orders found in selected date range", 'info');
      return;
    }

    const employeeOrderCount = filteredOrders.reduce((countMap, order) => {
      countMap[order.empId] = (countMap[order.empId] || 0) + 1;
      return countMap;
    }, {});

    const uniqueEmployees = Object.keys(employeeOrderCount).map(empId => ({
      empId,
      empName: orders.find(order => order.empId === empId).empName,
      orderCount: employeeOrderCount[empId]
    }));

    try {
      const formattedStartDate = format(startDate, 'yyyy/MM/dd');
      const formattedEndDate = format(endDate, 'yyyy/MM/dd');

      const doc = new jsPDF();
      doc.text(`Employee Order Details \n\nDuration: ${formattedStartDate} - ${formattedEndDate} `, 15, 10);
      
      const tableColumn = ["#", "Employee ID", "Employee Name", "Completed Orders"];
      const tableRows = uniqueEmployees.map((emp, index) => [
        index + 1,
        emp.empId,
        emp.empName,
        emp.orderCount
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [99, 143, 255],
          textColor: [255, 255, 255],
          fontSize: 12,
          halign: 'center',
        },
        bodyStyles: {
          fillColor: [245, 245, 245],
          textColor: [0, 0, 0],
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255],
        },
        margin: { top: 30 },
      });

      doc.save('order_history.pdf');
      addNotification("PDF downloaded successfully", 'success');
      setShowModal(false);
    } catch (error) {
      addNotification(`Error generating PDF: ${error.message}`, 'error');
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

      <div className={styles.leftDiv}>
        <Header />
      </div>
      <div className={styles.rightDiv}>
        <div className={styles.conOrder}>
          <div className={styles.title}>
            <h1><strong>Order History</strong></h1>
          </div>
          <div className={styles.content}>
            <div className={styles.downloadSection}>
              <button className={styles.downloadButton} onClick={handleDownloadClick}>
                Download as PDF
              </button>
            </div>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th className={styles["table-raw"]}>#</th>
                    <th className={styles["table-raw"]}>Order ID</th>
                    <th className={styles["table-raw"]}>Employee ID</th>
                    <th className={styles["table-raw"]}>Employee Name</th>
                    <th className={styles["table-raw"]}>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id}>
                      <td>#{index + 1}</td>
                      <td>{order.id}</td>
                      <td>{order.empId}</td>
                      <td>{order.empName}</td>
                      <td>{order.date} | {order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            <div className={styles.datePickerContainer}>
              <div className={styles.datePicker}>
                <label>Start Date:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select Start Date"
                />
              </div>
              <div className={styles.datePicker}>
                <label>End Date:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select End Date"
                />
              </div>
            </div>
            <button 
              className={styles.downloadButton1} 
              onClick={handleDownloadHistory}
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;