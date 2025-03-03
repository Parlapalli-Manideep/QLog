import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Features = () => {
  return (
    <section id="features" className="mt-5 text-center">
      <h3 className="h2 fw-bold text-dark">Why Choose QLog?</h3>
      <p className="text-secondary px-5">
        QLog offers a state-of-the-art authentication system that prioritizes security, convenience, and efficiency. Explore the features that make QLog your go-to authentication solution.
      </p>
      <div className="row mt-4">
        <div className="col-md-6 col-lg-4 p-3">
          <div className="card shadow-sm p-4">
            <h4 className="text-primary">🔐 QR Code Authentication</h4>
            <p className="text-secondary">
              Say goodbye to passwords! Securely log in with your unique QR code, eliminating the risk of credential leaks.
            </p>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 p-3">
          <div className="card shadow-sm p-4">
            <h4 className="text-primary">👥 Multi-User Access</h4>
            <p className="text-secondary">
              Each user gets their own QR code, ensuring privacy and independent access without interference.
            </p>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 p-3">
          <div className="card shadow-sm p-4">
            <h4 className="text-primary">📊 Manager Dashboard</h4>
            <p className="text-secondary">
              Admins and managers can track user login times, session durations, and manage overall system access efficiently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
