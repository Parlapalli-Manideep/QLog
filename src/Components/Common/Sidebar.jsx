import React, {useEffect, useState } from "react";
import { Home, BarChart, CalendarCheck, Users, Settings, QrCode, User} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SideBar = ({ isSidebarExpanded, setIsSidebarExpanded , role,id }) => {
    const [activeItem, setActiveItem] = useState("home");
    const navigate = useNavigate();
useEffect(() => {
    navigate("home",{state:{id}});
}, [id]);
    const handleItemClick = (item) => {
        setActiveItem(item);
        navigate(item ,{state:{id}});  
    };

    const menuItems = role === "manager" ? [
        { name: "home", label: "Home", icon: <Home size={24} /> },
        { name: "employees", label: "Employees", icon: <Users size={24} /> },
        { name: "manage", label: "Manage", icon: <Settings size={24} /> },
        { name: "analytics", label: "Analytics", icon: <BarChart size={24} /> },
        { name: "profile", label: "Profile", icon: <User size={24} /> },
    ] : [
        { name: "home", label: "Home", icon: <Home size={24} /> },
        { name: "attendance", label: "Attendance", icon: <CalendarCheck size={24} /> },
        { name: "stats", label: "Stats", icon: <BarChart size={24} /> },
        { name: "qrcode", label: "QR Code", icon: <QrCode size={24} /> },
        { name: "profile", label: "Profile", icon: <User size={24} /> },
    ];

    return (
        <div
            className="d-flex flex-column bg-dark text-white position-fixed h-100 p-3 z-3 overflow-hidden"
            style={{ width: isSidebarExpanded ? "200px" : "70px", transition: "0.3s" }}
            onMouseEnter={() => setIsSidebarExpanded(true)}
            onMouseLeave={() => setIsSidebarExpanded(false)}
        >
            <ul className="nav flex-column">
                {menuItems.map((item) => (
                    <li
                        key={item.name}
                        className={`nav-item mt-3 p-2 d-flex align-items-center rounded`}
                        style={{
                            cursor: "pointer",
                            transition: "0.3s",
                            display: "flex",
                            justifyContent: isSidebarExpanded ? "flex-start" : "center",
                            whiteSpace: "nowrap",
                            backgroundColor: activeItem === item.name ? "#0d6efd" : "transparent",
                            color: activeItem === item.name ? "white" : "inherit",
                        }}
                        onClick={() => handleItemClick(item.name)}
                        onMouseEnter={(e) => {
                            if (activeItem !== item.name) e.currentTarget.style.backgroundColor = "#444";
                        }}
                        onMouseLeave={(e) => {
                            if (activeItem !== item.name) e.currentTarget.style.backgroundColor = "transparent";
                        }}
                    >
                        <div>{item.icon}</div>
                        {isSidebarExpanded && <span className="ms-3">{item.label}</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBar;
