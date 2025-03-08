const About = ({ aboutRef }) => {
  return (
    <div className="container py-5" ref={aboutRef}>
      <div className="row align-items-center text-center text-md-start">
        <div className="col-md-6 text-center">
          <img
            src="https://scanova.io/blog/wp-content/uploads/2022/06/How-to-scan-a-QR-Code-from-a-screenshot.webp"
            alt="About QLog"
            className="img-fluid shadow-lg"
            style={{ maxWidth: "85%", borderRadius: "15px" }}
          />
        </div>

        <div className="col-md-6 mt-4 mt-md-0">
          <h2 className="fw-bold text-primary">Why Choose QLog?</h2>
          <p className="text-muted fs-5">
            Experience a cutting-edge, hassle-free authentication method that prioritizes security and efficiency.
          </p>
          <ul className="list-unstyled mt-3">
            {[  
              { icon: "fas fa-fingerprint", color: "text-success", text: "Biometric-Like Security with QR Codes" },
              { icon: "fas fa-mobile-alt", color: "text-primary", text: "No App Required – Scan with Any Device" },
              { icon: "fas fa-sync-alt", color: "text-warning", text: "Instant Login with Dynamic QR Codes" },
              { icon: "fas fa-user-shield", color: "text-danger", text: "Access Control & Role-Based Authentication" },
            ].map((item, index) => (
              <li key={index} className="d-flex align-items-center gap-3 py-2 px-3 rounded shadow-sm mb-2 bg-light">
                <i className={`${item.icon} ${item.color} fs-4`}></i>
                <span className="fw-semibold">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
