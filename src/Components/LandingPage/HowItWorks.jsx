import React from "react";

function HowItWorks({ howItWorksRef }) {
  return (
    <section className="py-5 bg-light text-center" ref={howItWorksRef}>
      <div className="container">
        <h2 className="fw-bold mb-4">How It Works</h2>
        <p className="text-muted mb-5">
          QLog simplifies authentication with a quick, secure QR-based login system.
        </p>

        <div className="row g-4">
          <div className="col-md-4 col-sm-6">
            <div
              className="card border-0 shadow p-3 h-100"
              style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                borderRadius: "8px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div className="mb-3">
                <img
                  src="https://dhiway.com/wp-content/uploads/2021/09/Artboard-2-1.png"
                  alt="Generate QR Code"
                  className="img-fluid w-100"
                  style={{ height: "180px", objectFit: "contain", borderRadius: "8px" }}
                />
              </div>
              <h5 className="fw-bold">Generate QR Code</h5>
              <p className="text-muted">
                Users receive a unique QR code upon registration.
              </p>
            </div>
          </div>

          <div className="col-md-4 col-sm-6">
            <div
              className="card border-0 shadow p-3 h-100"
              style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                borderRadius: "8px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div className="mb-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTW0r7hESbpYlu7CgUHRv9RXXvA5vJ-C_9WQ&s"
                  alt="Scan QR Code"
                  className="img-fluid w-100"
                  style={{ height: "180px", objectFit: "contain", borderRadius: "8px" }}
                />
              </div>
              <h5 className="fw-bold">Scan to Login</h5>
              <p className="text-muted">
                Users scan the QR code to authenticate instantly.
              </p>
            </div>
          </div>

          <div className="col-md-4 col-sm-12">
            <div
              className="card border-0 shadow p-3 h-100"
              style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                borderRadius: "8px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div className="mb-3">
                <img
                  src="https://t3.ftcdn.net/jpg/12/43/15/30/360_F_1243153029_q1tKivkYWxKL55S2g0ViVFJDDILVsmsh.jpg"
                  alt="Access Granted"
                  className="img-fluid w-100"
                  style={{ height: "180px", objectFit: "contain", borderRadius: "8px" }}
                />
              </div>
              <h5 className="fw-bold">Access Granted</h5>
              <p className="text-muted">
                Securely log in and manage sessions in real time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
