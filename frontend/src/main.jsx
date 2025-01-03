import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Employees from './pages/Employees';
import PendingOrder from './pages/Pending_Order';
import OrderHistory from './pages/OrderHistory';
 // Import OrderHistory component
 import EmployeeInterface from './pages/EmployeeInterface';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
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
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);