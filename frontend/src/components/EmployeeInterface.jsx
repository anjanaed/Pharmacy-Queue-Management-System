import React, { useState, useEffect, useContext } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Include external CSS for styling
import { auth, fireStore } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import "./EmployeeInterface.css";
import { useNavigate } from "react-router-dom";

const EmployeeInterface = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);



      const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
          const docRef = doc(fireStore, "uidMappings", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("User is not logged in");
          }
          setLoading(false);
        });
      };
      useEffect(() => {
        fetchUserData();
      }, []);
    
      if (loading) {
        return <div>Loading...</div>;
      }

    //const { employeeCode, setEmployeeCode } = useContext(EmployeeContext);
    const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.log(error.message);
    }
  };
  

  const [currentOrder, setCurrentOrder] = useState(() => {
    const savedCurrentOrder = localStorage.getItem("currentOrder");
    return savedCurrentOrder ? Number(savedCurrentOrder) : 0;
  });

  const [newOrder, setNewOrder] = useState(() => {
    const savedNewOrder = localStorage.getItem("newOrder");
    return savedNewOrder ? Number(savedNewOrder) : 1;
  });

  const [tokens, setTokens] = useState(() => {
    const savedTokens = localStorage.getItem("tokens");
    return savedTokens ? JSON.parse(savedTokens) : [];
  });

  const [activeMenu, setActiveMenu] = useState("generateToken");

  useEffect(() => {
    localStorage.setItem("currentOrder", currentOrder);
    localStorage.setItem("newOrder", newOrder);
    localStorage.setItem("tokens", JSON.stringify(tokens));
  }, [currentOrder, newOrder, tokens]);

  const handlePrintToken = () => {
    const timestamp = new Date();
    const token = {
      orderNumber: newOrder,
      date: timestamp.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: timestamp.toLocaleTimeString("en-US"),
    };

    setTokens((prevTokens) => [...prevTokens, token]);
    setCurrentOrder(newOrder);
    setNewOrder(newOrder + 1);
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

  //const { employeeCode } = useContext(EmployeeContext);
  
  

  return (
    
    <div className="container">
      {/* Sidebar Menu */}
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

      {/* Main Content */}
     
      <main className="content">
        {activeMenu === "generateToken" && (
          <section className="generate-token">
            
            


            <div className="token-generator">
      <header className="header">
        <h1>Token Generator</h1>
        {employeeCode && (
          <p className="employee-code">Logged in as: <strong>{userData.customUID}</strong> <br></br>
          <br></br>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
          </p>
        )}
        
      </header>
      
      {/* Token generator functionality here */}
    </div>







            <div className="card">
              <div className="details">
                <p>
                  Current Order Number: <strong>{currentOrder}</strong>
                </p>
                <p>
                  New Order Number: <strong>{newOrder}</strong>
                </p>
              </div>
              <button className="primary-btn" onClick={handlePrintToken}>
                Print Token
              </button>
            </div>
          </section>
        )}

        {activeMenu === "orderHistory" && (
          <section className="order-history">
        


            <div className="token-generator">
      <header className="header">
        <h1>Order History</h1>
        {employeeCode && (
          <p className="employee-code">Logged in as: <strong>{userData.customUID}</strong>
           <br></br>
          <br></br>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
          </p>
        )}
      </header>
      {/* Token generator functionality here */}
    </div><br></br>






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
            
          </section>
          
        )}
      </main>
    </div>
  );

  
};

export default EmployeeInterface;
