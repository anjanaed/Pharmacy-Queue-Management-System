import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './notfound.module.css';

const NotFound=()=>{
    const navigate=useNavigate()

    return(
        <div className={styles.mainBox}>
            <div className={styles.content}>Oops! 404 Not Found <br/>
            <button onClick={()=>navigate('/')}>Go Back</button>
            </div>
        </div>
    )
}

export default NotFound