import React, { useState, useEffect } from 'react';
import Header from "../Header/Header";  // Correct if Header.jsx is in the Header folder
import styles from './order_history.module.css';
import axios from 'axios';
import { format } from 'date-fns';
import Loading from '../Loading/Loading';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchOrders = async () => {
    try {
      // Fetch orders
      const ordersResponse = await axios.get("http://127.0.0.1:3000/api/order");
      const fetchedOrders = ordersResponse.data.filter((order) => order.orderStatus === "Completed").map((order) => {
        const datee = new Date(order.orderDate);
        const formattedDate = format(datee, 'yyyy-MM-dd'); // Format as YYYY-MM-DD
        return {
          id: order.orderID,
          empId: order.EmpID,
          date: formattedDate,
          time: order.orderTime,
          stat: order.orderStatus,
        };
      });

      // Fetch employees
      const employeesResponse = await axios.get("http://127.0.0.1:3000/api/employee");
      const employees = employeesResponse.data;
      console.log(employees)

      // Create a mapping of employee IDs to employee names
      const employeeMap = employees.reduce((map, employee) => {
        map[employee.empID] = employee.name;
        return map;
      }, {});

      console.log(employeeMap[1])

      // Map employee names to orders
      const ordersWithEmployeeNames = fetchedOrders.map((order) => ({
        ...order,
        empName: employeeMap[order.empId] || 'Unknown',
      }));

      setOrders(ordersWithEmployeeNames);
    } catch (err) {
      console.log(err);
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
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDownloadHistory = () => {
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
    });

    const employeeOrderCount = filteredOrders.reduce((countMap, order) => {
      countMap[order.empId] = (countMap[order.empId] || 0) + 1;
      return countMap;
    
    }, {});

    const uniqueEmployees = Object.keys(employeeOrderCount).map(empId => {
      return {
        empId,
        empName: orders.find(order => order.empId === empId).empName,
        orderCount: employeeOrderCount[empId]
      };
    });

    const formattedStartDate = format(startDate, 'yyyy/MM/dd');
    const formattedEndDate = format(endDate, 'yyyy/MM/dd');
    


    const doc = new jsPDF();
    doc.text(`Employee Order Details \n\nDuration: ${formattedStartDate} - ${formattedEndDate} `, 15, 10,);
    const tableColumn = ["#","Employee ID", "Employee Name", "Completed Orders"];
    const tableRows = [];

    uniqueEmployees.forEach((emp, index) => {
      const orderData = [
        index + 1,
        emp.empId,
        emp.empName,
        emp.orderCount
      ];
      tableRows.push(orderData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid', // You can change the theme to 'striped', 'grid', or 'plain'
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [99, 143, 255], // Custom header color
        textColor: [255, 255, 255], // Custom header text color
        fontSize: 12,
        halign: 'center',
      },
      bodyStyles: {
        fillColor: [245, 245, 245],
        textColor:[0,0,0],
        halign: 'center', // Custom body color
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255], // Custom alternate row color
      },
      margin: { top: 30 },
    });


    doc.save('order_history.pdf');

    setShowModal(false);
  };

  return (
    <div className={styles.full}>
      <div className={styles.leftDiv}>
        <Header />
      </div>
      <div className={styles.rightDiv}>
        <header className={styles.title}>
          <h1>Order History</h1>
          <div className={styles.downloadButtonContainer}>
            <button className={styles.downloadButton} onClick={handleDownloadClick}>Download as PDF</button>
          </div>
        </header>
        <div className={styles.content}>
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
                  placeholderText="Select start date"
                />
              </div>
              &nbsp;&nbsp;&nbsp;
              <div className={styles.datePicker}>
                <label>End Date:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select end date"
                />
              </div>
            </div>
            <button className={styles.downloadButton1} onClick={handleDownloadHistory}>Download History</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;


