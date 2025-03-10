import React from "react";
import "./LoginModal.css";
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
                                <img src="https://as2.ftcdn.net/jpg/02/09/79/01/1000_F_209790157_lni2Rip3Dm1YrTNPW6jCuSI6sIADbrKD.jpg" 
                                     alt="Manager" 
                                     className="rounded-circle mb-2 img-fluid" 
                                     style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                                <button className="btn btn-primary w-100" onClick={()=>{
                                    navigate("/Login",{state :{ role:"manager"}})
                                }}>Manager Login</button>
                            </div>
                            <div className="text-center">
                                <img src="https://png.pngtree.com/png-vector/20190316/ourmid/pngtree-employee-icon-design-template-vector-isolated-png-image_856368.jpg" 
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
