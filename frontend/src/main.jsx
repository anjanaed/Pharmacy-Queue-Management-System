import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Employees from './components/Employees';
import PendingOrder from './components/Pending_Order';
import OrderHistory from './components/OrderHistory';
import Login from './components/login';
import Register from './components/register';
import EmployeeInterface from './components/EmployeeInterface';




const router = createBrowserRouter([
  {
    path: "/employees",
    element: <Employees />,
  },
  {
    path: "/pending-order",
    element: <PendingOrder />,
  },
  {
    path: "/user",
    element: <EmployeeInterface />,
  },
  {
    path: "/order-history",
    element: <OrderHistory />, // Add route for OrderHistory
  },
  {
    path: "/login",
    element: <Login />, // Add route for OrderHistory
  },
  {
    path: "/register",
    element: <Register />, // Add route for OrderHistory
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);