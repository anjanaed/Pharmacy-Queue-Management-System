import './header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBox, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div>
      <header className="App-header">
        <div className="navbar">
          <Link to="/current-order"><FontAwesomeIcon icon={faClipboard} /> Current Order</Link>
          <Link to="/employees"><FontAwesomeIcon icon={faUser} /> Employees</Link>
          <Link to="/order-history"><FontAwesomeIcon icon={faBox} /> Order History</Link>
        </div>
      </header>
    </div>
  );
}

export default Header;