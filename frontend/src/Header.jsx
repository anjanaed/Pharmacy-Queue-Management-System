import './header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBox, faClipboard, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="container">
      <header className="App-header">
        <div className="navbar_base">
          <div className="navbar">
            <Link to="/pending-order"><FontAwesomeIcon icon={faClipboard} /> Pending Order</Link>
            <Link to="/employees"><FontAwesomeIcon icon={faUser} /> Employees</Link>
            <Link to="/order-history"><FontAwesomeIcon icon={faBox} /> Order History</Link>
          </div>
          <div className="logout">
            <Link to="/"><FontAwesomeIcon icon={faArrowRightFromBracket} /> Log Out</Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;