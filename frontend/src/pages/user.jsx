import React, { useState, useEffect } from "react";
import { auth, fireStore } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const User = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      const docRef = doc(fireStore, "uidMappings", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      Welcome -{userData.customUID} <br />
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default User;
