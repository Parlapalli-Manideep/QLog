import React from "react";
import "./Home.css"

function Home({ homeRef }) {
    return (
            <section className="hero d-flex flex-column align-items-center text-center" ref={homeRef}>
                <h1>Seamless QR Code Authentication for Secure Access!</h1>
                <p>Sign in instantly with a QR code—secure, fast, and hassle-free!</p>
            </section>
    );
}

export default Home;
