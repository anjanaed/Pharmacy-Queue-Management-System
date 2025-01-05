import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import useAuth from "../useAuth";
import Loading from "../components/Loading/Loading";


const ProtectedEmpRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading/>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }


  return children;
};

export default ProtectedEmpRoutes;