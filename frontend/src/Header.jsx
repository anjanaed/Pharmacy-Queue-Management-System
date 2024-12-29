import './header.css';
function Header() {
  return (
    <div>
      <header className="App-header">
      <div className="navbar">
        <a href="#Current Order">Current Order</a>
        <a href="#Employees">Employees</a>
        <a href="#Order History">Order History</a>
      </div>
      </header>
    </div>
  );
}
export default Header;