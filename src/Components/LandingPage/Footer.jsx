import React from "react";

function Footer({ footerRef }) {
  return (
    <footer ref={footerRef} style={{ backgroundColor: "#121212", color: "#E0E0E0" }} className="py-5">
      <div className="container">
        <div className="row text-center text-md-start">
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h4 className="fw-bold text-white">QLog</h4>
            <p style={{ color: "#B0B0B0" }}>
              A secure, seamless, and efficient QR-based authentication system designed for modern security needs.
            </p>
          </div>

          <div className="col-12 col-md-4 col-lg-3 mb-4 mb-md-0">
            <h5 className="fw-bold text-white">Contact</h5>
            <ul className="list-unstyled">
              <li>
                <a href="mailto:support@qlog.com" className="text-decoration-none" style={{ color: "#B0B0B0" }}>
                  support@qlog.com
                </a>
              </li>
              <li>
                <i className="fas fa-phone-alt me-2"></i>
                <a href="tel:+1234567890" className="text-decoration-none" style={{ color: "#B0B0B0" }}>
                  +91 123 456 7890 
                </a>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-4 col-lg-3 mb-4 mb-md-0">
            <h5 className="fw-bold text-white">Legal</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none" style={{ color: "#B0B0B0" }}>Privacy Policy</a></li>
              <li><a href="#" className="text-decoration-none" style={{ color: "#B0B0B0" }}>Terms of Service</a></li>
            </ul>
          </div>

          <div className="col-12 col-lg-2 text-center text-lg-end">
            <h5 className="fw-bold text-white">Follow Us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="https://www.facebook.com" target="_blank" className="text-decoration-none" style={{ color: "#B0B0B0" }}>
                Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com" target="_blank" className="text-decoration-none" style={{ color: "#B0B0B0" }}>
                Instagram
                </a>
              </li>
              <li>
                <a href="https://www.threads.net" target="_blank" className="text-decoration-none" style={{ color: "#B0B0B0" }}>
                Threads
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com" target="_blank" className="text-decoration-none" style={{ color: "#B0B0B0" }}>
                LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.x.com" target="_blank" className="text-decoration-none" style={{ color: "#B0B0B0" }}>
                X
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-4">
          <p style={{ color: "#B0B0B0" }}>© 2025 QLog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
