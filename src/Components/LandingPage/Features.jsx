import React from "react";

const features = [
    {
      icon: "🚀",
      title: "Seamless Login",
      description: "Scan and log in instantly without passwords."
    },
    {
      icon: "🔐",
      title: "Secure QR Codes",
      description: "Each QR code is encrypted and unique."
    },
    {
      icon: "📊",
      title: "Session Tracking",
      description: "Monitor login times and session durations."
    },
    {
      icon: "👥",
      title: "Multi-User Access",
      description: "Each user has isolated access."
    },
    {
      icon: "📢",
      title: "Admin Monitoring",
      description: "Managers can track login details."
    }
  ];
  

const Features = ({ featuresRef }) => {
    return (
    <div className="container text-center py-5" ref={featuresRef}>
      <div className="row justify-content-center">
        {features.map((feature, index) => (
          <div key={index} className="col-md-4 col-sm-6 mb-4">
            <div className="card p-4 border-0 shadow-sm text-center" style={{ borderRadius: "10px" }}>
              <div className="fs-1">{feature.icon}</div> 
              <h5 className="mt-3 fw-bold">{feature.title}</h5> 
              <p className="text-muted">{feature.description}</p> 
            </div>
          </div>
        ))}
      </div>
    </div>

    )
}
export default Features;
