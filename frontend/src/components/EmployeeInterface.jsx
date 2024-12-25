import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { auth, fireStore } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import "./EmployeeInterface.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeInterface = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(fireStore, "uidMappings", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("User is not logged in");
        }
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.log(error.message);
    }
  };

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

  if (loading) {
    return <div>Loading...</div>;
  }

  const handlePrintToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/orderNumber/increment"
      );
      const newOrderNumber = response.data.currentOrderNumber;

      const timestamp = new Date();
      const token = {
        orderNumber: newOrderNumber,
        date: timestamp.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: timestamp.toLocaleTimeString("en-US"),
      };

      setTokens((prevTokens) => [...prevTokens, token]);
      setCurrentOrder(newOrderNumber);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleClearHistory = () => {
    setTokens([]);
    localStorage.removeItem("tokens");
    setCurrentOrder(0);
    setNewOrder(1);
    localStorage.removeItem("currentOrder");
    localStorage.removeItem("newOrder");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Order History", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Number", "Order Number", "Date", "Time"]],
      body: tokens.map((token, index) => [
        index + 1,
        `Order Number - ${token.orderNumber}`,
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
                {userData && (
                  <p className="employee-code">
                    Logged in as: <strong>{userData.customUID}</strong>
                    <br />
                    <br />
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </p>
                )}
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
                {userData && (
                  <p className="employee-code">
                    Logged in as: <strong>{userData.customUID}</strong>
                    <br />
                    <br />
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </p>
                )}
              </header>
              <div className="actions">
                <button className="secondary-btn" onClick={handleDownloadPDF}>
                  Download PDF
                </button>
                <button className="danger-btn" onClick={handleClearHistory}>
                  Clear History
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Order Number</th>
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
                        <td>{token.date}</td>
                        <td>{token.time}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
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
