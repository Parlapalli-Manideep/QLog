const About = ({ aboutRef }) => {
    return (
      <div className="container py-5" ref={aboutRef}>
        <div className="row align-items-center">
          <div className="col-md-6 text-center">
            <img
              src="https://scanova.io/blog/wp-content/uploads/2022/06/How-to-scan-a-QR-Code-from-a-screenshot.webp"
              alt="About QLog"
              className="img-fluid shadow-lg"
              style={{ maxWidth: "85%", borderRadius: "15px" }}
            />
          </div>
  
          <div className="col-md-6">
            <p className="text-muted">
              QLog is a QR-based authentication system designed for fast and secure logins. 
              It eliminates the need for passwords by allowing users to sign in using encrypted QR codes.
            </p>
            <ul className="list-unstyled">
              <li className="d-flex align-items-center">
                <i className="fas fa-shield-alt text-success me-2"></i> Secure & Password-Free Login
              </li>
              <li className="d-flex align-items-center">
                <i className="fas fa-qrcode text-primary me-2"></i> Quick Authentication with QR Codes
              </li>
              <li className="d-flex align-items-center">
                <i className="fas fa-clock text-warning me-2"></i> Real-time Session Tracking
              </li>
              <li className="d-flex align-items-center">
                <i className="fas fa-users text-danger me-2"></i> Multi-User & Admin Support
              </li>
            </ul>
          </div>
        </div>       
      </div>
    );
  };
  
  export default About;
  