import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore } from "./firebase";
import { useState } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.css";


const Register = () => {
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");


  // const generateCustomUID = async () => {
  //   const usersRef = doc(fireStore, "metadata", "users");
  //   const usersDoc = await getDoc(usersRef);
  //   let customUID = "E01";

  //   if (usersDoc.exists()) {
  //     const data = usersDoc.data();
  //     const lastUID = data.lastUID || "E00";
  //     const lastNumber = parseInt(lastUID.substring(1), 10);
  //     customUID = `E${String(lastNumber + 1).padStart(2, "0")}`;
  //   }

  //   await setDoc(usersRef, { lastUID: customUID }, { merge: true });
  //   return customUID;
  // };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // await createUserWithEmailAndPassword(auth, email, password);
      // const customUID = await generateCustomUID();
      // const user = auth.currentUser;
      // console.log(user);
      // if (user) {
      //   await setDoc(doc(fireStore, "Users", customUID), {
      //     role: "Employee",
      //   });
      //   await setDoc(doc(fireStore, "uidMappings", user.uid), {
      //     customUID,
      //   });
        const data = {
          empID: id,
          name: name,
          email: email
        };
        axios
          .post("http://localhost:3000/api/employee/", data)
          .then((result) => console.log(result))
          .catch((err) => console.log(err));
        
        console.log("User Registerd");
      }
     catch (error) {
      console.log(error.message);
        }}
  

  return (
    <div className="login-wrapper">
      <div className="row g-0 login-container">
      {/* Left Side */}
      <div className="col-md-6 left-side d-flex flex-column justify-content-center align-items-center">
          <img
            src="public/img/logo.png"
            alt="Logo"
            className="left-image"
          />
          <img
            src="public/img/pills.png"
            alt="Pills"
            className="right-image"
          />
      </div>
      {/* Right Side */}
      <div className=" right-side d-flex flex-column justify-content-center">
      <h3 className="text-center register-heading">PharmacyLanka</h3>
        <form onSubmit={handleRegister} className="form-container">
        <div className="mb-3 position-relative">
        <label htmlFor="id" className="form-label smaller-text">Employee ID</label>
        <input
          onChange={(e) => setId(e.target.value)}
          className="form-control form-control-lg text-box-small ps-2"
          placeholder="Enter your ID"
          type="id"
          id="id"
          name="id"
        />
        </div>
        <div className="mb-3 position-relative">
        <label htmlFor="name" className="form-label smaller-text">Name</label>
        <input
          onChange={(e) => setName(e.target.value)}
          className="form-control form-control-lg text-box-small ps-2"
          placeholder="Enter your Name"
          type="name"
          id="name"
          name="name"
        />
        </div>
        <div className="mb-3 position-relative">
        <label htmlFor="pass" className="form-label smaller-text">Email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="form-control form-control-lg text-box-small ps-2"
          placeholder="Enter your Email"
          type="email"
          id="email"
          name="email"
        />
     </div>
 
     <button 
  type="submit" 
  className="custom-button"
>
  Register
</button>     
        
       
      </form>

    </div>
      
  </div>
</div>
  );
}

export default Register;
