import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const HeroSection = () => {
  return (
    <section className="mt-5 text-center">
      <h2 className="display-4 fw-bold text-dark">Experience Next-Level Security with QLog</h2>
      <p className="lead text-secondary mt-3 px-5">
        QLog is a cutting-edge authentication system that ensures your digital safety. With our unique QR code login mechanism, say goodbye to passwords and hello to seamless, secure access.
      </p>
      <p className="text-secondary px-5">
        Whether you are an individual looking for a secure login or an organization managing multiple users, QLog offers an intuitive and efficient solution to keep your data safe.
      </p>
      <div className="mt-4">
        <Link to="/Signup" className="btn btn-primary btn-lg me-3">Get Started</Link>
        <Link to="/Login" className="btn btn-outline-primary btn-lg">Login</Link>
      </div>
      <div className="mt-5">
      </div>
    </section>
  );
};

export default HeroSection;
