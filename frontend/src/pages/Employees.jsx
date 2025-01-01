import React, { useState } from 'react';
import Header from "../Header";
import './Employees.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Employees = () => {
  const [employees, setEmployees] = useState([
    { id: 1, employeeId: 'E001', email: 'employee1@gmail.com', name: 'John Doe' },
    { id: 2, employeeId: 'E002', email: 'employee2@gmail.com', name: 'Jane Smith' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const addEmployee = () => {
    // Logic to add a new employee
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
  };

  const handleSave = () => {
    // Define the logic for saving the edited employee details
    console.log('Employee details saved:', currentEmployee);
    setIsModalOpen(false);
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  return (
    <div className="container">
      <Header />
      <main>
        <header className="main-content">
          <h1>Employees</h1>
        </header>
        <div className="content">
          <div className="new">
            <button className="add-new" onClick={addEmployee}>+ Add New</button>
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
                <tr key={employee.id}>
                  <td>{index + 1}</td>
                  <td>{employee.employeeId}</td>
                  <td>{employee.email}</td>
                  <td>{employee.name}</td>
                  <td>
                    <button className="edit" onClick={() => handleEdit(employee)}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                    <button className="delete" onClick={() => deleteEmployee(employee.id)}><FontAwesomeIcon icon={faTrash} /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Edit Employee</h2>
            <form>
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
              <button type="button" onClick={handleSave}>Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
