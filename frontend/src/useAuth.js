import {useState,useEffect} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import {auth} from './components/firebase'

const useAuth=()=>{
    const [user,setUser]=useState(null);
    const[loading,setLoading]=useState(true)

    useEffect(()=>{
        const unsub=onAuthStateChanged(auth,(user)=>{
            setUser(user);
            setLoading(false);
        });
        return()=>unsub();
    },[]);
    return {user,loading}
};

export default useAuth;