import React, { useState } from "react";
import "./Header.css";
import LoginModal from "../Modals/LoginModal";
import logo from "../../assets/Logo.ico";

function Header({ handleHome, handleFeatures, handleAbout, handleHowItWorks, handleFaqSection, handleFooter }) {
    const [showModal, setShowModal] = useState(false);

    const closeNavbar = () => {
        const navbar = document.getElementById("navbarSupportedContent");
        if (navbar.classList.contains("show")) {
            navbar.classList.remove("show");
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top">
                <div className="container-fluid bg-white d-flex">
                    <img 
                        src={logo}
                        alt="Bootstrap" 
                        width="30" 
                        height="30" 
                    />

                    <h1 onClick={handleHome} style={{cursor:"pointer", fontFamily: "Courier New, Courier, monospace"}} className="navbar-brand fs-2 fw-bold">QLog</h1>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-center pb-3" id="navbarSupportedContent">
                        <ul className="navbar-nav d-flex justify-content-center align-items-center w-100">
                            <li className="nav-item">
                                <button onClick={() => { handleFeatures(); closeNavbar(); }} className="nav-link">Features</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={() => { handleAbout(); closeNavbar(); }} className="nav-link">About</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={() => { handleHowItWorks(); closeNavbar(); }} className="nav-link">How it works</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={() => { handleFaqSection(); closeNavbar(); }} className="nav-link">FAQ's</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={() => { handleFooter(); closeNavbar(); }} className="nav-link">Contact</button>
                            </li>
                        </ul>

                        <div className="d-lg-none text-center mt-3">
                            <button onClick={() => setShowModal(true)} className="btn btn-outline-success">Login</button>
                        </div>
                    </div>

                    <div className="d-none d-lg-block">
                        <button className="btn btn-outline-success" onClick={() => setShowModal(true)}>Login</button>
                    </div>
                </div>
            </nav>

            <LoginModal show={showModal} handleClose={() => setShowModal(false)} />
        </>
    );
}

export default Header;
