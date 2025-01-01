import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore } from "./components/firebase.js";
import { setDoc, doc } from "firebase/firestore";


const UID="EMP080"
const email="anjiijjjhhhhgvjknbjgbi@gmail.com"
const password="05102002"
const rolee="Admin" //Employee or Admin


async function userInject(){
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log("User Registered Successfully")
      if (user) {
        await setDoc(doc(fireStore, "Users", UID), {
          role: rolee,
        });
        await setDoc(doc(fireStore, "uidMappings", user.uid), {
          UID,
        })
   
    }
    }catch(err){
        console.log(err.message);
    }

}
    
userInject();



