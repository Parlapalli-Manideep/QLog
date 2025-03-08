import React from "react";

function FaqSection({ faqRef }) {
  return (
    <section className="py-5 bg-light" ref={faqRef}>
      <div className="container">
        <h2 className="fw-bold text-center mb-4">Frequently Asked Questions</h2>
        <p className="text-muted text-center mb-5">
          Find answers to common questions about QLog's QR-based authentication system.
        </p>

        <div className="accordion" id="faqAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className="accordion-button fw-bold" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#faq1"
              >
                How does QLog work?
              </button>
            </h2>
            <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
              <div className="accordion-body text-muted">
                QLog generates a unique QR code for each user. Simply scan it using the QLog system to log in securely without a password.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className="accordion-button collapsed fw-bold" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#faq2"
              >
                Is QLog secure?
              </button>
            </h2>
            <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body text-muted">
                Yes! QLog uses encrypted QR codes and secure authentication protocols to ensure safety.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className="accordion-button collapsed fw-bold" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#faq3"
              >
                Can multiple users use QLog?
              </button>
            </h2>
            <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body text-muted">
                Absolutely! QLog supports multiple users with individual QR codes, and admins can track session activity.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className="accordion-button collapsed fw-bold" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#faq4"
              >
                What happens if I lose my QR code?
              </button>
            </h2>
            <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body text-muted">
                No worries! You can regenerate a new QR code by logging into your account or contacting the admin.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className="accordion-button collapsed fw-bold" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#faq5"
              >
                Can I use QLog on multiple devices?
              </button>
            </h2>
            <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body text-muted">
                Yes! You can scan your QR code from any device to log in securely.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default FaqSection;
