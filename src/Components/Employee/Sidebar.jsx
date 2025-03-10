import React from "react";
import { List, Calendar } from "lucide-react";

function Sidebar({ activeSection, setActiveSection }) {
    return (
        <div className="sidebar d-flex flex-column p-3 vh-100">
            <h4 className="text-center mb-4">Employee Panel</h4>
            
            <div 
                className={`sidebar-item p-2 ${activeSection === "home" ? "bg-primary" : ""}`} 
                onClick={() => setActiveSection("home")}
            >
                <List className="me-2" /> Home
            </div>

            <div 
                className={`sidebar-item p-2 mt-2 ${activeSection === "attendance" ? "bg-primary" : ""}`} 
                onClick={() => setActiveSection("attendance")}
            >
                <Calendar className="me-2" /> Attendance
            </div>
        </div>
    );
}

export default Sidebar;
