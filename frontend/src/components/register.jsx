import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore } from "./firebase";
import { useState } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const generateCustomUID = async () => {
    const usersRef = doc(fireStore, "metadata", "users");
    const usersDoc = await getDoc(usersRef);
    let customUID = "E01";

    if (usersDoc.exists()) {
      const data = usersDoc.data();
      const lastUID = data.lastUID || "E00";
      const lastNumber = parseInt(lastUID.substring(1), 10);
      customUID = `E${String(lastNumber + 1).padStart(2, "0")}`;
    }

    await setDoc(usersRef, { lastUID: customUID }, { merge: true });
    return customUID;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const customUID = await generateCustomUID();
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(fireStore, "Users", customUID), {
          role: "Employee",
        });
        await setDoc(doc(fireStore, "uidMappings", user.uid), {
          customUID,
        });
        const data = {
          empID: customUID,
          name: name,
          email: email,
          phone: phone,
        };
        axios
          .post("http://localhost:3000/api/employee/", data)
          .then((result) => console.log(result))
          .catch((err) => console.log(err));
      }

      console.log("User Registerd");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <label htmlFor="name">Name:</label>
        <br />
        <input
          onChange={(e) => setName(e.target.value)}
          type="name"
          id="name"
          name="name"
        />
        <br />
        <label htmlFor="email">Email:</label>
        <br />
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email"
          name="email"
        />
        <br />
        <label htmlFor="pass">Password:</label>
        <br />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="pass"
          name="pass"
        />
        <br />
        <label htmlFor="pass">Phone Number:</label>
        <br />
        <input
          onChange={(e) => setPhone(e.target.value)}
          type="num"
          id="num"
          name="num"
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default Register;
