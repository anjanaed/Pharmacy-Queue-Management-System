import React, { useState, useEffect } from 'react';
import Header from "../Header/Header";
import styles from './Employees.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import Notification from '../Notifications/Notification';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    const id = Date.now();
    setNotification({ id, message, type });
  };

  const apiUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;



  const handleNotificationClose = () => {
    setNotification(null);
  };

    useEffect(() => {
      const notificationMessage = localStorage.getItem('registerNotification');
      if (notificationMessage) {
        showNotification(notificationMessage, 'success');
        localStorage.removeItem('registerNotification');
      }
    }, []);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/employee`);
      const fetchedEmployee = response.data.map((emp) => ({
        id: emp.empID,
        email: emp.email,
        name: emp.name
      }));
      setEmployees(fetchedEmployee);
      setLoading(false);
    } catch (error) {
      showNotification("Error Fetching Employees: " + error.message, 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({ id: '', name: '', email: '' });

  const handleEdit = (employee) => {
    setCurrentEmployee({ ...employee });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee({ id: '', name: '', email: '' });
  };

  const handleSave = async (empid) => {
    try {
      await axios.put(`${apiUrl}/api/employee/${empid}`, {
        name: currentEmployee.name,
        email: currentEmployee.email
      });
      showNotification("Employee Details Updated", 'success');
      fetchEmployee();
      setIsModalOpen(false);
    } catch (err) {
      showNotification("Error Updating Employee: " + err.message, 'error');
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/employee/${id}`);
      showNotification("Employee Deleted Successfully", 'success');
      fetchEmployee();
    } catch (err) {
      showNotification("Error Deleting Employee: " + err.message, 'error');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.full}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
      <div className={styles.leftDiv}>
        <Header />
      </div>
      <div className={styles.rightDiv}>
        <header className={styles.title}>
          <h1><strong>Employee Details</strong></h1>
        </header>
        <div className={styles.content}>
          <div className={styles.new}>
            <button className={styles['add-new']} onClick={() => navigate("/register")}>Register New Employee</button>
          </div>
          <table>
            <thead>
              <tr>
                <th className={styles.myth}>Number</th>
                <th className={styles.myth}>Employee ID</th>
                <th className={styles.myth}>E-mail</th>
                <th className={styles.myth}>Name</th>
                <th className={styles.myth}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee.id}>
                  <td>{index + 1}</td>
                  <td>{employee.id}</td>
                  <td>{employee.email}</td>
                  <td>{employee.name}</td>
                  <td>
                    <button className={styles.edit} onClick={() => handleEdit(employee)}>
                      <FontAwesomeIcon icon={faPenToSquare} /> 
                    </button>
                    <button className={styles.delete} onClick={() => deleteEmployee(employee.id)}>
                      <FontAwesomeIcon icon={faTrash} /> 
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles['modal-content1']}>
            <span className={styles.close} onClick={handleCloseModal}>&times;</span>
            <h2>Edit Employee</h2>
            <form>
              <label>
                Employee ID:
                <input
                  type="text"
                  value={currentEmployee.id}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, id: e.target.value })}
                  disabled
                />
              </label>
              <label>
                Name:
                <input
                  type="text"
                  value={currentEmployee.name}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, name: e.target.value })}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={currentEmployee.email}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, email: e.target.value })}
                />
              </label>
              <button type="button" onClick={() => handleSave(currentEmployee.id)}>Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;