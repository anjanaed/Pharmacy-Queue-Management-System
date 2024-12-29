import './header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBox, faClipboard,faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="container">
      <header className="App-header">
            <div class="logo">
                <div class="logo-shape"></div>
            </div>
        <div className="navbar">
          <Link to="/current-order"><FontAwesomeIcon icon={faClipboard} /> Current Order</Link>
          <Link to="/employees"><FontAwesomeIcon icon={faUser} /> Employees</Link>
          <Link to="/order-history"><FontAwesomeIcon icon={faBox} /> Order History</Link>
          <Link to="/"><FontAwesomeIcon icon={faArrowRightFromBracket} /> Log Out</Link>
        </div>     
      </header>
    </div>
  );
}

export default Header;