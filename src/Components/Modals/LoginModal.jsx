import React from "react";
import "./LoginModal.css";
import manager from "../../Assets/manager.jpg"; 
import employee from "../../Assets/employee.jpg";
import { useNavigate } from "react-router-dom";

function LoginModal({ show, handleClose }) {
    const navigate = useNavigate()
    return (
        <div className={`modal ${show ? "show d-block" : "d-none"}`} tabIndex="-1" onClick={handleClose}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}> 
                <div className="modal-content p-4">
                    <div className="modal-header border-0">
                        <h5 className="modal-title text-center w-100">Select Login Type</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body text-center">
                        <div className="d-flex justify-content-center align-items-center gap-4 flex-column flex-md-row">
                            <div className="text-center">
                                <img src= {manager}
                                     alt="Manager" 
                                     className="rounded-circle mb-2 img-fluid" 
                                     style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                                <button className="btn btn-primary w-100" onClick={()=>{
                                    navigate("/Login",{state :{ role:"manager"}})
                                }}>Manager Login</button>
                            </div>
                            <div className="text-center">
                                <img src={employee} 
                                     alt="Employee" 
                                     className="rounded-circle mb-2 img-fluid" 
                                     style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                                <button className="btn btn-success w-100" onClick={()=>{
                                    navigate("/Login",{state :{ role:"employee"}})
                                }}>Employee Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;
