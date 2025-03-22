import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { getUserByEmail, getUserById } from "../../Services/Users";
import Header from "../../Components/Common/Header";
import SideBar from "../../Components/Common/Sidebar";

function Manager() {
    const location = useLocation();
    const managerId = location.state?.id;
    const [managerEmail,setManagerEmail]=useState(null)
    const [manager, setManager] = useState({});
    const [activeComponent, setActiveComponent] = useState("home");
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    useEffect( ()=>
    {
        const fetchData = async ( ) =>
        {
            const data = await getUserById(managerId,"manager");
            setManagerEmail(data?.email)
        }
        fetchData()
    }
    ,[managerId]
    )
    useEffect(() => {
        const fetchManager = async () => {
            const user = await getUserByEmail(managerEmail,"manager");
            setManager(user); 
        };

        fetchManager();
    }, [managerEmail]);

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
                id={managerId}
            />

                <div className="container mt-5">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Manager;
