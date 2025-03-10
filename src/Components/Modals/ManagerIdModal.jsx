import React, { useState } from "react";

const ManagerIdModal = ({ onSubmit }) => {
    const [managerId, setManagerId] = useState("");

    const handleSubmit = () => {
        if (!managerId.trim()) return; 
        onSubmit(managerId);
    };

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-4">
                    <div className="modal-header border-0">
                        <h5 className="modal-title text-center w-100">Enter Manager ID</h5>
                    </div>

                    <div className="modal-body text-center">
                        <img 
                            src="https://static.vecteezy.com/system/resources/previews/005/950/870/non_2x/punctual-employee-icon-design-of-avatar-with-clock-vector.jpg"
                            alt="Manager Icon"
                            className="mb-3 rounded-circle"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                        <input
                            type="text"
                            value={managerId}
                            onChange={(e) => setManagerId(e.target.value)}
                            className="form-control mb-3"
                            placeholder="Enter Manager ID"
                        />
                        <button 
                            onClick={handleSubmit} 
                            className="btn btn-primary w-100"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerIdModal;
