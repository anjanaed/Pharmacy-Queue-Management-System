import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Employees from './components/Employee/Employees';
import PendingOrder from './components/PendingOrder/Pending_Order';
import OrderHistory from './components/OrderHistory/OrderHistory';
import Login from './components/Login/login';
import Register from './components/Register/register';
import EmployeeInterface from './components/EmployeeInterface/EmployeeInterface';
import ProtectedAdminRoutes from './protectedAdminRoutes';
import ProtectedEmpRoutes from './protectedEmpRoutes';
import ProtectedLogin from './protectedLogin';
import AutoRouting from './autoRouting';
import NotFound from './notFound';





const router = createBrowserRouter([
  {
    path: "/",
    element:(<AutoRouting><NotFound/></AutoRouting>) ,
  },
  {
    path: "/employees",
    element:(<ProtectedAdminRoutes><Employees /></ProtectedAdminRoutes>) ,
  },
  {
    path: "/pending-order",
    element:(<ProtectedAdminRoutes><PendingOrder /></ProtectedAdminRoutes>) ,
  },
  {
    path: "/user",
    element: 
    (<ProtectedEmpRoutes><EmployeeInterface /></ProtectedEmpRoutes>)
    ,
  },
  {
    path: "/order-history",
    element: (<ProtectedAdminRoutes><OrderHistory /></ProtectedAdminRoutes>), // Add route for OrderHistory
  },
  {
    path: "/login",
    element: (<ProtectedLogin><Login /></ProtectedLogin>), // Add route for OrderHistory
  },
  {
    path: "/register",
    element: (<ProtectedAdminRoutes><Register /></ProtectedAdminRoutes>), // Add route for OrderHistory
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);