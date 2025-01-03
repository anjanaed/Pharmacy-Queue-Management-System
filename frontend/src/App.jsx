import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import User from "./pages/user";
import Employees from "./pages/Employees"
import Header from "./Header";

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
