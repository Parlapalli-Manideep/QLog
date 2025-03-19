import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserByEmail } from "../../Services/Users";
import Header from "../../Components/Common/Header";
import SideBar from "../../Components/Common/Sidebar";
import Home from "../../Components/Manager/Home";
import Employees from "../../Components/Manager/Employees";
import Analytics from "../../Components/Manager/Analytics";
import Manage from "../../Components/Manager/Manage";
import ManagerProfile from "../../Components/Manager/managerProfile";

function Manager() {
    const location = useLocation();
    const managerEmail = location.state?.email || "";
    const managerRole = location.state?.role || "";
    const [manager, setManager] = useState({});
    const [activeComponent, setActiveComponent] = useState("home");
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    useEffect(() => {
        const fetchManager = async () => {
            const user = await getUserByEmail(managerEmail, managerRole);
            setManager(user); 
        };

        fetchManager();
    }, [managerEmail, managerRole]);

    return (
        <div className="d-flex">
             <div className="ms-auto" style={{ marginLeft: isSidebarExpanded ? "200px" : "70px", transition: "0.3s", width: "100%" }}>
                {manager && (
                    <Header
                        name={manager.name}
                        id={manager.id}
                        role={manager.role}
                    />
                )}
                <SideBar
                isSidebarExpanded={isSidebarExpanded}
                setIsSidebarExpanded={setIsSidebarExpanded}
                setActiveComponent={setActiveComponent}
                role="manager"
            />

                <div className="container mt-5">
                    {activeComponent === "home" && <Home manager={manager}/>}
                    {activeComponent === "employees" && <Employees staff={manager.staff} /> }
                    {activeComponent === "manage" && <Manage managerId = {manager.id} staff = {manager.staff}/>}
                    {activeComponent === "analytics" && <Analytics manager={manager}/>}
                    {activeComponent === "profile" && <ManagerProfile manager={manager}/>}
                </div>
            </div>
        </div>
    );
}

export default Manager;
