import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import User from "./components/user";
import Employees from "./components/Employees"
import EmployeeInterface from "./components/EmployeeInterface";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<Employees />} />
      </Routes>
    </Router>
  );
}

export default App;
