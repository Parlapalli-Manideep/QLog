import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBug, FaSignOutAlt, FaUserCog } from "react-icons/fa";
import ModalComponent from "../Modals/ModalComponent";

const Header = ({ name, id, role }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setShowLogoutConfirm(false);
        navigate("/Login", { state: { role } });
    };

    return (
        <>
            <header className="d-flex justify-content-between align-items-center px-4 py-2 bg-light shadow-sm position-sticky top-0 z-2">
                <div>
                    <h5 className="mb-0 fw-bold">{name || role }</h5>
                    <small className="text-muted">Manager ID: {id || "N/A"}</small>
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
                            <hr className="my-1" />
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

            <ModalComponent 
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                show={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
            />
        </>
    );
};

export default Header;
