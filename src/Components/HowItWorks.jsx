import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="mt-5 text-center">
      <h3 className="h2 fw-bold text-dark">How QLog Works</h3>
      <p className="text-secondary px-5">
        QLog simplifies authentication with an intuitive QR code-based login system. Follow these easy steps to get started.
      </p>
      <div className="row mt-4">
        <div className="col-md-4 p-3">
          <div className="card shadow-sm p-4">
            <h4 className="text-primary">📝 Step 1: Sign Up</h4>
            <p className="text-secondary">
              Register with QLog, and the system will generate a unique QR code linked to your account.
            </p>
          </div>
        </div>
        <div className="col-md-4 p-3">
          <div className="card shadow-sm p-4">
            <h4 className="text-primary">📲 Step 2: Scan & Login</h4>
            <p className="text-secondary">
              Use your QR code for authentication. Simply scan it using the QLog interface to access your account securely.
            </p>
          </div>
        </div>
        <div className="col-md-4 p-3">
          <div className="card shadow-sm p-4">
            <h4 className="text-primary">📊 Step 3: Track & Manage</h4>
            <p className="text-secondary">
              Managers can monitor login times, session durations, and overall access activity in real-time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
