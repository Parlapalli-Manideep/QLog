import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { FaBug, FaSignOutAlt, FaUserCog } from "react-icons/fa";

const EmployeeHeader = ({ userData, onShowQR }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const dropdownRef = useRef(null);
    const logoutModalRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (logoutModalRef.current && !logoutModalRef.current.contains(event.target)) {
                setShowLogoutConfirm(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setShowLogoutConfirm(false);
        navigate("/Login", { state: { role: "employee" } });
    };

    return (
        <>
            <header className="d-flex justify-content-between align-items-center px-4 py-2 bg-light shadow-sm fixed-top">
                <div onClick={onShowQR} style={{ cursor: "pointer" }}>
                    <h5 className="mb-0 fw-bold">{userData?.name || "Employee"}</h5>
                    <small className="text-muted">Manager ID: {userData?.managerId || "N/A"}</small>
                </div>

                <div className="position-relative" ref={dropdownRef}>
                    <FaUserCog
                        className="fs-4 text-secondary"
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{ cursor: "pointer" }}
                    />
                    {showDropdown && (
                        <div className="position-absolute end-0 mt-2 bg-white rounded shadow p-2 border">
                            <div 
                                className="p-2 d-flex align-items-center text-dark" 
                                onClick={() => window.location.href = "mailto:support@example.com"}
                                style={{ cursor: "pointer" }}
                            >
                                <FaBug className="me-2" /> Report Bug
                            </div>
                            <hr className="my-1" /> {/* Separator line */}
                            <div 
                                className="p-2 d-flex align-items-center text-danger" 
                                onClick={() => setShowLogoutConfirm(true)}
                                style={{ cursor: "pointer" }}
                            >
                                <FaSignOutAlt className="me-2" /> Logout
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <Modal show={showLogoutConfirm} centered backdrop="static" keyboard={false}>
                <div ref={logoutModalRef}>
                    <Modal.Header>
                        <Modal.Title>Confirm Logout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to logout?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleLogout}>Logout</Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
};

export default EmployeeHeader;
