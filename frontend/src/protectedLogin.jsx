import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import useAuth from "./useAuth";
import { getDoc, doc } from "firebase/firestore";
import { fireStore } from "./components/firebase";

const ProtectedLogin = ({ children }) => {
  const { user, loading } = useAuth();


  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (user){
        return <Navigate to="/"/>;
  }

  return children;
};

export default ProtectedLogin;