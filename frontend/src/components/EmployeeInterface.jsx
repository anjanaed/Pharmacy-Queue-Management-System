import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import "./EmployeeInterface.css";

const EmployeeInterface = () => {
  const [employeeID, setEmployeeID] = useState(""); // New state variable for employee ID
  const [currentOrder, setCurrentOrder] = useState(0);
  const [tokens, setTokens] = useState(() => {
    const savedTokens = localStorage.getItem("tokens");
    return savedTokens ? JSON.parse(savedTokens) : [];
  });

  const [activeMenu, setActiveMenu] = useState("generateToken");

  useEffect(() => {
    localStorage.setItem("tokens", JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    const fetchOrderNumber = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/orderNumber"
        );
        setCurrentOrder(response.data.currentOrderNumber);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchOrderNumber();
  }, []);

  const handlePrintToken = async () => {
    try {
      const employeeIDWithPrefix = `E${employeeID}`;
      const checkResponse = await axios.get(
        `http://localhost:3000/api/employee/check/${employeeIDWithPrefix}`
      );

      if (!checkResponse.data.exists) {
        alert("Invalid Employee ID");
        return;
      }

      // Fetch employee data
      const employeeResponse = await axios.get(
        `http://localhost:3000/api/employee/${employeeIDWithPrefix}`
      );
      console.log("Employee Data:", employeeResponse.data);

      const response = await axios.post(
        "http://localhost:3000/api/orderNumber/increment"
      );
      const newOrderNumber = response.data.currentOrderNumber;

      const timestamp = new Date();
      const token = {
        orderNumber: newOrderNumber,
        employeeID: employeeIDWithPrefix,
        date: timestamp.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: timestamp.toLocaleTimeString("en-US"),
      };

      setTokens((prevTokens) => [...prevTokens, token]);
      setCurrentOrder(newOrderNumber);

      alert("Order Placed Successfully");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Invalid Employee ID");
      } else {
        console.log(error.message);
      }
    }
  };

  const handleClearHistory = () => {
    setTokens([]);
    localStorage.removeItem("tokens");
    setCurrentOrder(0);
    localStorage.removeItem("currentOrder");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Order History", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Number", "Order Number", "Employee ID", "Date", "Time"]],
      body: tokens.map((token, index) => [
        index + 1,
        `Order Number - ${token.orderNumber}`,
        token.employeeID,
        token.date,
        token.time,
      ]),
    });
    doc.save("Order_History.pdf");
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <h3 className="logo">TokenGen</h3>
        <nav className="menu">
          <button
            className={`menu-item ${
              activeMenu === "generateToken" ? "active" : ""
            }`}
            onClick={() => setActiveMenu("generateToken")}
          >
            Generate Token
          </button>
          <button
            className={`menu-item ${
              activeMenu === "orderHistory" ? "active" : ""
            }`}
            onClick={() => setActiveMenu("orderHistory")}
          >
            Order History
          </button>
        </nav>
      </aside>

      <main className="content">
        {activeMenu === "generateToken" && (
          <section className="generate-token">
            <div className="token-generator">
              <header className="header">
                <h1>Token Generator</h1>
                <div className="employee-code">
                  <label htmlFor="employeeID">Employee ID:</label>
                  <input
                    type="text"
                    id="employeeID"
                    value={`E${employeeID}`}
                    onChange={(e) => setEmployeeID(e.target.value.replace("E", ""))}
                  />
                </div>
              </header>
              <div className="card">
                <div className="details">
                  <p>
                    Current Order Number: <strong>{currentOrder}</strong>
                  </p>
                </div>
                <button className="primary-btn" onClick={handlePrintToken}>
                  Print Token
                </button>
              </div>
            </div>
          </section>
        )}

        {activeMenu === "orderHistory" && (
          <section className="order-history">
            <div className="token-generator">
              <header className="header">
                <h1>Order History</h1>
              </header>
              <div className="actions">
                <button className="danger-btn" onClick={handleClearHistory}>
                  Clear History
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Order Number</th>
                    <th>Employee ID</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.length > 0 ? (
                    tokens.map((token, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>Order Number - {token.orderNumber}</td>
                        <td>{token.employeeID}</td>
                        <td>{token.date}</td>
                        <td>{token.time}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No history available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default EmployeeInterface;