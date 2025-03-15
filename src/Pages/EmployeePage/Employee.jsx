import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getUserByEmail, getUserById } from "../../Services/Users";
import Header from "../../Components/Common/Header";
import ManagerIdModal from "../../Components/Modals/ManagerIdModal";
import Attendance from "../../Components/Employee/Attendance";
import SideBar from "../../Components/Common/Sidebar";
import Home from "../../Components/Employee/Home"; 
import Stats from "../../Components/Employee/Stats";
import QRCodeComponent from "../../Components/Employee/QRCodeComponent";
import Profile from "../../Components/Employee/Profile";

const Employee = () => {
    const location = useLocation();
    const employeeEmail = location.state?.email;
    const employeeRole = location.state?.role;

    const [employee, setEmployee] = useState(null);
    const [manager, setManager] = useState(null);
    const [showManagerModal, setShowManagerModal] = useState(false);
    const [activeComponent, setActiveComponent] = useState("home");
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            if (!employeeEmail || !employeeRole) return;
            
            const employeeUser = await getUserByEmail(employeeEmail, employeeRole);
            setEmployee(employeeUser);

            if (!employeeUser.managerId) {
                setShowManagerModal(true);
                return;
            }

            const managerUser = await getUserById(employeeUser.managerId, "manager");
            setManager(managerUser);
        };

        fetchEmployee();
    }, [employeeEmail, employeeRole]); 

    return (
        <div className="d-flex">
            <SideBar
                isSidebarExpanded={isSidebarExpanded}
                setIsSidebarExpanded={setIsSidebarExpanded}
                setActiveComponent={setActiveComponent}
            />

            <div className="ms-auto" style={{ marginLeft: isSidebarExpanded ? "200px" : "70px", transition: "0.3s", width: "100%" }}>
                {employee && (
                    <ManagerIdModal
                        employee={employee}
                        show={showManagerModal}
                        onClose={() => setShowManagerModal(false)}
                        onUpdate={(updatedEmployee) => setEmployee(updatedEmployee)}
                    />
                )}
                {employee && <Header name={employee.name} id={employee.managerId} role={employee.role} />}

                <div className="container mt-5">
                    {manager && activeComponent === "home" && <Home employee={employee} manager={manager} />}
                    {activeComponent === "attendance" && <Attendance loginSessions={employee.LoginSessions}/>}
                    {activeComponent === "stats" && <Stats loginSessions={employee.LoginSessions} leaves = {employee.Leaves}/>}
                    {activeComponent === "qrcode" && <QRCodeComponent employee={employee}/>}
                    {activeComponent === "profile" && <Profile employee={employee}/>}
                </div>
            </div>
        </div>
    );
};

export default Employee;
