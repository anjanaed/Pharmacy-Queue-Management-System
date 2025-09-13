import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore } from "../frontend/src/components/firebase.js";
import { setDoc, doc } from "firebase/firestore";


const UID="EMP029"
const email="employee@gmail.com"
const password="05102002"
const rolee="Employee" //Employee or Admin


async function userInject(){
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log("User Registered Successfully")
      if (user) {
        await setDoc(doc(fireStore, "Users", user.uid), {
          role: rolee,
        });
   
    }
    }catch(err){
        console.log(err);
    }

}
    
userInject();



