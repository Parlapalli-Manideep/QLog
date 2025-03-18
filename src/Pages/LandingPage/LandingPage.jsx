import { useRef } from "react";
import Header from "../../Components/LandingPage/Header";
import Home from "../../Components/LandingPage/Home";
import Features from "../../Components/LandingPage/Features";
import About from "../../Components/LandingPage/About";
import HowItWorks from "../../Components/LandingPage/HowItWorks";
import FaqSection from "../../Components/LandingPage/FaqSection";
import Footer from "../../Components/LandingPage/Footer";

function LandingPage() {
    const homeRef = useRef(null);
    const featuresRef = useRef(null);
    const aboutRef = useRef(null);
    const howItWorksRef = useRef(null);
    const faqRef = useRef(null);
    const footerRef = useRef(null);

    const handleScroll = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
             <Header
                handleHome={() => handleScroll(homeRef)}
                handleFeatures={() => handleScroll(featuresRef)}
                handleAbout={() => handleScroll(aboutRef)}
                handleHowItWorks={() => handleScroll(howItWorksRef)}
                handleFaqSection={() => handleScroll(faqRef)}
                handleFooter={() => handleScroll(footerRef)}
            />

            <Home homeRef={homeRef} />
            <Features featuresRef={featuresRef} />
            <About aboutRef={aboutRef} />
            <HowItWorks howItWorksRef={howItWorksRef} />
            <FaqSection faqRef={faqRef} />
            <Footer footerRef={footerRef} />
        </>
    );
}

export default LandingPage;
