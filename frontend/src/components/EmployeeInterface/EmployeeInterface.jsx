import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./EmployeeInterface.module.css";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const EmployeeInterface = () => {
  const [employeeID, setEmployeeID] = useState("");
  const [currentOrder, setCurrentOrder] = useState(0);
  const[loading,setLoading]=useState(false)

  const [activeMenu, setActiveMenu] = useState("generateToken");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const employeeIDRef = useRef(null);
  const printTokenButtonRef = useRef(null);


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

    const handleLogOut=async()=>{
      console.log("clicked")
      try{
        await signOut(auth);
        console.log("logged out");
        navigate('/login')
      }catch(err){
        console.log(err)
      }
    }

  useEffect(() => {


    fetchOrderNumber();
    const interval = setInterval(fetchOrderNumber, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        printTokenButtonRef.current.click();
      } else {
        employeeIDRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const showPopupMessage = () => {
    const popup = document.getElementById('popupMessage');
    const overlay = document.getElementById('popupOverlay');
    popup.classList.add('show');
    overlay.classList.add('show');
    setTimeout(() => {
      popup.classList.remove('show');
      overlay.classList.remove('show');
    }, 1000);
  };

  const showErrorPopup = (message) => {
    const errorPopup = document.getElementById('errorPopup');
    errorPopup.textContent = message;
    errorPopup.classList.add('show');
    setTimeout(() => {
      errorPopup.classList.remove('show');
    }, 3000);
  };

  const handlePrintToken = async () => {
    setLoading(true)
    try {
      const employeeIDWithPrefix = employeeID;
      const checkResponse = await axios.get(
        `http://localhost:3000/api/employee/check/${employeeIDWithPrefix}`
      );

      if (!checkResponse.data.exists) {
        showErrorPopup("Invalid Employee ID");
        return;
      }


      await fetchOrderNumber()

      const timestamp = new Date();
      const orderData = {
        orderID: currentOrder,
        orderDate : timestamp.toLocaleDateString("en-CA"),
        orderTime: timestamp.toLocaleTimeString("en-US"),
        orderStatus: "Pending",
        EmpID: employeeID
      };
      const orderDate = timestamp.toLocaleDateString("en-CA");
      console.log(orderDate)

      try {
        const orderResponse = await axios.post("http://localhost:3000/api/order", orderData);
        console.log("Order posted successfully:", orderResponse.data);
        const response = await axios.post(
          "http://localhost:3000/api/orderNumber/increment"
        );
        setCurrentOrder(response.data.currentOrderNumber);


      } catch (error) {
        console.error("Error posting order:", error);
        setLoading(false);
      }

      showPopupMessage();
    } catch (error) {
      setLoading(false); // Add this line to reset loading state on error
      if(error.response && error.response.status === 404) {
        showErrorPopup("Invalid Employee ID");
      } else {
        console.log(error.message);
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...!</div>;
  }

  return (
    <div className={styles.container}>
      <button className={styles.logout} onClick={handleLogOut}>Logout</button>
      <main className={styles.content}>
        {activeMenu === "generateToken" && (
          <section className={styles['generate-token']}>
            <div className={styles['token-generator']}>
              <div className={styles.details}>
                <p>
                  Recent Order Number: <strong>{currentOrder-1}</strong>
                </p>
              </div>
              
              <div className={styles['token-box']}>
              <header className={styles.header}>
                Generate Token
              </header>
                <div className={styles['employee-code']}>
                  <label htmlFor="employeeID">Employee ID:</label>
                  <input
                    type="text"
                    id="employeeID"
                    ref={employeeIDRef}
                    value={employeeID}
                    onChange={(e) => setEmployeeID(e.target.value)}
                  />
                </div>
                <button className={styles['primary-btn']} ref={printTokenButtonRef} onClick={handlePrintToken}>
                  Print Token
                </button>
                <div >
                  <p>
                    <strong>
                      {currentDateTime.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      {currentDateTime.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: true,
                      })}
                    </strong>
                  </p>
                </div>
                <div id="popupMessage" className={styles['popup-message']}>Order Placed Successfully</div>
                <div id="popupOverlay" className={styles['popup-overlay']}></div>
                <div id="errorPopup" className={styles['error-popup']}></div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default EmployeeInterface;