import React from "react";
import { Home, BarChart, Settings, CalendarCheck, QrCode } from "lucide-react";

const SideBar = ({ isSidebarExpanded, setIsSidebarExpanded, setActiveComponent }) => {
    return (
        <div
            className="d-flex flex-column bg-dark text-white position-fixed h-100 p-3 z-3"
            style={{ width: isSidebarExpanded ? "200px" : "70px", transition: "0.3s" }}
            onMouseEnter={() => setIsSidebarExpanded(true)}
            onMouseLeave={() => setIsSidebarExpanded(false)}
        >
            <div className="text-center mb-4">Menu</div>
            <ul className="nav flex-column">
                <li className="nav-item mt-5" onClick={() => setActiveComponent("home")}>
                    <Home size={24} className="mx-auto" />
                    {isSidebarExpanded && <span className="ms-2">Home</span>}
                </li>
                <li className="nav-item mt-5" onClick={() => setActiveComponent("attendance")}>
                    <CalendarCheck size={24} className="mx-auto" />
                    {isSidebarExpanded && <span className="ms-2">Attendance</span>}
                </li>
                <li className="nav-item mt-5" onClick={() => setActiveComponent("stats")}>
                    <BarChart size={24} className="mx-auto" />
                    {isSidebarExpanded && <span className="ms-2">Stats</span>}
                </li>
                <li className="nav-item mt-5" onClick={() => setActiveComponent("qrcode")}>
                    <QrCode size={24} className="mx-auto" />
                    {isSidebarExpanded && <span className="ms-2">QR Code</span>}
                </li>
                <li className="nav-item mt-5" onClick={() => setActiveComponent("settings")}>
                    <Settings size={24} className="mx-auto" />
                    {isSidebarExpanded && <span className="ms-2">Settings</span>}
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
