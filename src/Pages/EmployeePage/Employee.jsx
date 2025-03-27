import React, { useState, useEffect } from "react";
import { Outlet, useLocation} from "react-router-dom";
import { getUserById } from "../../Services/Users";
import Header from "../../Components/Common/Header";
import SideBar from "../../Components/Common/Sidebar";

const Employee = () => {
    const location = useLocation();
    const employeeId = location.state?.id;
    const [employee, setEmployee] = useState(null);
    const [manager, setManager] = useState(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    
    useEffect(() => {
        if (!employeeId) {
            return;
        }
        const fetchEmployee = async () => {
            const employeeUser = await getUserById(employeeId,"employee");
            setEmployee(employeeUser);

            if (!employeeUser?.managerId) {
                setShowManagerModal(true);
                return;
            }

            const managerUser = await getUserById(employeeUser?.managerId, "manager");
            setManager(managerUser);
        };

        fetchEmployee();
    }, [employeeId]);

    return (
        <div className="d-flex">
            <div className="ms-auto" style={{ marginLeft: isSidebarExpanded ? "200px" : "70px", transition: "0.3s", width: "100%" }}>
                 <Header name={employee?.name} id={employee?.managerId} role={employee?.role} />
                <SideBar
                    isSidebarExpanded={isSidebarExpanded}
                    setIsSidebarExpanded={setIsSidebarExpanded}
                    role="employee"
                    id={employee?.id}
                />
                <div className="mt-4 " style={{ marginLeft: "70px"}}>
                <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Employee;