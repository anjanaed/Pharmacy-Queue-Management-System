import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import useAuth from "../useAuth";


const ProtectedEmpRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }


  return children;
};

export default ProtectedEmpRoutes;