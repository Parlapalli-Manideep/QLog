import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer id="contact" className="mt-5 py-4  text-center">
      <h4 className="fw-bold text-dark">Stay Connected with QLog</h4>
      <p className="text-secondary px-5">
        Have questions? Need support? Reach out to us anytime. We are here to ensure your authentication experience remains smooth and secure.
      </p>
      <div className="mt-3">
        <p className="text-dark fw-bold">Email: support@qlog.com</p>
        <p className="text-dark fw-bold">Phone: +1 (555) 123-4567</p>
      </div>
      <div className="mt-3">
        <a href="#" className="text-primary text-decoration-none mx-2">Privacy Policy</a>
        <a href="#" className="text-primary text-decoration-none mx-2">Terms of Service</a>
      </div>
      <p className="text-secondary mt-3">&copy; {new Date().getFullYear()} QLog. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
