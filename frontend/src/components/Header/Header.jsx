import './header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBox, faClipboard, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate,Link } from 'react-router-dom';
import { auth } from '../firebase';
import React from 'react';
import { signOut } from 'firebase/auth';

function Header() {
  const navigate=useNavigate();

  const handleLogOut=async()=>{
    console.log("clicked")
    try{
      await signOut(auth);
      localStorage.setItem('logoutNotification', 'Logged out successfully');
      navigate('/login')
    }catch(err){
      console.log(err)
    }
  }


  return (
    <div >
        <div className="navbar_base">
          <div className="navbar">
            <Link to="/pending-order"><FontAwesomeIcon icon={faClipboard} /> Pending Order</Link>
            <Link to="/employees"><FontAwesomeIcon icon={faUser} /> Employees</Link>
            <Link to="/order-history"><FontAwesomeIcon icon={faBox} /> Order History</Link>
          </div>
          <div className="logout" onClick={handleLogOut}>
            <FontAwesomeIcon icon={faArrowRightFromBracket}/> Log Out
          </div>
        </div>
    </div>
  );
}

export default Header;