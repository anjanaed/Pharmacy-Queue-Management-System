import Header from "../Header";
import './Employees.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function Employees() {
  const [employees, setEmployees] = useState([
    { id: 1, employeeId: 'E001', email: 'employee1@gmail.com', name: 'John Doe' },
    { id: 2, employeeId: 'E002', email: 'employee2@gmail.com', name: 'Jane Smith' }
  ]);

  const addEmployee = () => {
    // Logic to add a new employee
  };

  const editEmployee = (id) => {
    // Logic to edit an employee
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
                    <button className="edit" onClick={() => editEmployee(employee.id)}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                    <button className="delete" onClick={() => deleteEmployee(employee.id)}><FontAwesomeIcon icon={faTrash} /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Employees;
