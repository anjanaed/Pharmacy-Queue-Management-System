import React, { useState,useEffect } from 'react';
import Header from "../Header";
import styles from './Employees.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const[loading,setLoading]=useState(true);


  const fetchEmployee = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3000/api/employee");
      console.log(response);

      const fetchedEmployee = response.data
        .map((emp) => ({
          id: emp.empID,
          email:emp.email,
          name: emp.name
        }));
      setEmployees(fetchedEmployee);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

      useEffect(() => {
    
    
        fetchEmployee();

      }, []);



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({ id: '', name: '', email: ''});

  const addEmployee = () => {
    // Logic to add a new employee
  };

  const handleEdit = (employee) => {
    setCurrentEmployee({ ...employee, });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee({ id: '', name: '', email: ''});
  };

  const handleSave = async (empid) => {
    try{
      await axios.put(`http://127.0.0.1:3000/api/employee/${empid}`,{
        name:currentEmployee.name,
        email:currentEmployee.email
      }).then((res)=>{
        console.log("updated")
        fetchEmployee()
      })
    }catch(err){
      console.log(err)
    }


    // Define the logic for saving the edited employee details
    console.log('Employee details saved:', currentEmployee);
    setIsModalOpen(false);
  };

  const deleteEmployee = async (id) => {
    try{
      await axios.delete(`http://127.0.0.1:3000/api/employee/${id}`)
      .then((res)=>{
        console.log("User Deleted")
        console.log(res)
        fetchEmployee()
      }
      )}catch(err){
        console.log(err)
      }
    }
  



  return (
    <div className={styles.full}>
      <div className={styles.leftDiv}>
      <Header />
      </div>
    <div className={styles.rightDiv}>
      <header className={styles.title}>
        <h1>Employee Details</h1>
      </header>
      <div className={styles.content}>
        <div className={styles.new}>
          <button className={styles['add-new']} onClick={addEmployee}>+ Add New</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Employee ID</th>
              <th>Gmail</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr >
                <td>{index + 1}</td>
                <td>{employee.id}</td>
                <td>{employee.email}</td>
                <td>{employee.name}</td>
                <td>
                  <button className={styles.edit} onClick={() => handleEdit(employee)}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                  <button className={styles.delete} onClick={() => deleteEmployee(employee.id)}><FontAwesomeIcon icon={faTrash} /> Delete</button>
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
            <button type="button" onClick={()=>handleSave(currentEmployee.id)}>Save</button>
          </form>
        </div>
      </div>
    )}
  </div>
  );
}

export default Employees;
