import React, { useState } from "react";
import "./Header.css";
import LoginModal from "./LoginModal";

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
            <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
                <div className="container-fluid">
                    <img 
                        src="https://preview.redd.it/itachi-uchiha-v0-lkypptlpl8nd1.jpeg?auto=webp&s=2d798537a7ab59725da65a6c580498f6e1360192" 
                        alt="Bootstrap" 
                        width="30" 
                        height="24" 
                    />

                    <button onClick={handleHome} className="navbar-brand">QLog</button>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
                        <ul className="navbar-nav d-flex justify-content-center w-100">
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
                                <button onClick={() => { handleFooter(); closeNavbar(); }} className="nav-link">Footer</button>
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
