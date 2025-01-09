import React from "react";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Employees from "./components/Employee/Employees";
import PendingOrder from "./components/PendingOrder/Pending_Order";
import OrderHistory from "./components/OrderHistory/OrderHistory";
import Login from "./components/Login/login";
import Register from "./components/Register/register";
import EmployeeInterface from "./components/EmployeeInterface/EmployeeInterface";
import ProtectedAdminRoutes from "./protectedRoutes/protectedAdminRoutes";
import ProtectedEmpRoutes from "./protectedRoutes/protectedEmpRoutes";
import ProtectedLogin from "./protectedRoutes/protectedLogin";
import AutoRouting from "./protectedRoutes/autoRouting";
import NotFound from "./components/Deadend/notFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AutoRouting/>
    ),
    errorElement:<NotFound/>
  },
  {
    path: "/employees",
    element: (
      <ProtectedAdminRoutes>
        <Employees />
      </ProtectedAdminRoutes>
    ),
  },
  {
    path: "/pending-order",
    element: (
      <ProtectedAdminRoutes>
        <PendingOrder />
      </ProtectedAdminRoutes>
    ),
  },
  {
    path: "/user",
    element: (
      <ProtectedEmpRoutes>
        <EmployeeInterface />
      </ProtectedEmpRoutes>
    ),
  },
  {
    path: "/order-history",
    element: (
      <ProtectedAdminRoutes>
        <OrderHistory />
      </ProtectedAdminRoutes>
    ), // Add route for OrderHistory
  },
  {
    path: "/login",
    element: (
      <ProtectedLogin>
        <Login />
      </ProtectedLogin>
    ), // Add route for OrderHistory
  },
  {
    path: "/register",
    element: (
      <ProtectedAdminRoutes>
        <Register />
      </ProtectedAdminRoutes>
    ), // Add route for OrderHistory
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
