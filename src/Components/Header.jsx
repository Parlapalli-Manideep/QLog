import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  return (
    <header className="d-flex justify-content-between align-items-center bg-white shadow">
      <h1 className="text-primary" >QLog</h1>
      <nav>
        <Link to="/features" className="mx-3 text-dark text-decoration-none">Features</Link>
        <Link to="/how-it-works" className="mx-3 text-dark text-decoration-none">How It Works</Link>
        <Link to="/contact" className="mx-3 text-dark text-decoration-none">Contact</Link>
        <Link to="/login" className="btn btn-primary ms-3">Login</Link>
      </nav>
    </header>
  );
};

export default Header;
