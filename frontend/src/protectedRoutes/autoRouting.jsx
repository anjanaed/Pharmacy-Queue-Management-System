import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../useAuth";
import { getDoc, doc } from "firebase/firestore";
import { fireStore } from "../components/firebase";
import Loading from "../components/Loading/Loading";

const AutoRouting = ({ children }) => {
  const { user, loading } = useAuth();
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const checkRoles = async () => {
      if (user) {
        try {
          const docRef = doc(fireStore, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const role = docSnap.data().role;
            console.log(role);
            if (role == "Admin") {
              setAdmin(true);
              setCheckingAccess(false);
            }
            setCheckingAccess(false)
          } else {
            console.log("No role data");
            setCheckingAccess(false);
          }
        } catch (error) {
          console.error("Error fetching document:", error);
          setCheckingAccess(false);
        }
      } else {
        setCheckingAccess(false);
      }
    };

    if (!loading) {
      checkRoles();
    }
  }, [user, loading]);

  if (checkingAccess) {
    return <Loading/>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (admin) {
    return <Navigate to="/pending-order" />;
  } else {
    return <Navigate to="/user" />;
  }

  return children;
};

export default AutoRouting;
