import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserByEmail } from "../../Services/Users";
import Header from "../../Components/Common/Header";

function Manager() {
    const location = useLocation();
    const managerEmail = location.state?.email || "";
    const managerRole = location.state?.role || "";
    const [manager, setManager] = useState({});
    useEffect(() => {
        const fetchManager = async () => {
            const user = await getUserByEmail(managerEmail, managerRole);
            setManager(user); 
        };

        fetchManager();
    }, [managerEmail, managerRole]); 
    return (
        <>
           {manager && (
                <Header
                    name={manager.name}
                    id={manager.id}
                    role={manager.role}
                />
            )}
        </>
    );
}

export default Manager;
