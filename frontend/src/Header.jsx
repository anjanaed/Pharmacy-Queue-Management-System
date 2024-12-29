import './header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faBox } from '@fortawesome/free-solid-svg-icons'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'

function Header() {
  return (
    <div>
      <header className="App-header">
      <div className="navbar">
        <a href="#Current Order"><FontAwesomeIcon icon={faClipboard} />  Current Order</a>
        <a href="#Employees"><FontAwesomeIcon icon={faUser} />   Employees</a>
        <a href="#Order History"><FontAwesomeIcon icon={faBox} />  Order History</a>
      </div>
      </header>
    </div>
  );
}
export default Header;