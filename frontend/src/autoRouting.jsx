import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import useAuth from "./useAuth";
import { getDoc, doc } from "firebase/firestore";
import { fireStore } from "./components/firebase";

const AutoRouting = ({ children }) => {
  const { user, loading } = useAuth();
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [admin,setAdmin]=useState(false)

  useEffect(() => {
    const checkRoles = async () => {
      if (user) {
        try {
          const docRef = doc(fireStore, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()){
            const role=docSnap.data().role;
            console.log(role)
            if (role=="Admin"){
              setAdmin(true);
            }
            setCheckingAccess(false);

        }else{
            console.log("No role data");
            setCheckingAccess(false);
        }
        }catch (error) {
          console.error("Error fetching document:", error);
        }
      }
      
    };

    checkRoles();
  }, [user]);

  if (checkingAccess) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

    if(admin){
        return <Navigate to="/pending-order"/>;
    }else{
        return <Navigate to ="/user"/>
    }
  

  return children;
};

export default AutoRouting;