import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getUserByEmail } from "../../Services/Users";
import Header from "../../Components/Common/Header"; 
import ManagerIdModal from "../../Components/Modals/ManagerIdModal"
const Employee = () =>{
    const location = useLocation();
    const employeeEmail = location.state?.email || email;
    const employeeRole = location.state?.role || role;
    
    const [employee, setEmployee] = useState(null);
    const [manager, setManager] = useState(null);
    const [showManagerModal, setShowManagerModal] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            const user = await getUserByEmail(employeeEmail, employeeRole);
            setEmployee(user);
            if (!user.managerId) {
                setShowManagerModal(true);
            }
            const userManager = await getUserById(employee.managerId, manager);
            setEmployee(userManager);
        };

        fetchEmployee();
    }, [employeeEmail, employeeRole]);

    return (
        <>
            {employee && <Header name={employee.name} id={employee.managerId} role={employee.role} />}

            {employee && (
                <ManagerIdModal
                    employee={employee}
                    show={showManagerModal}
                    onClose={() => setShowManagerModal(false)}
                    onUpdate={(updatedEmployee) => setEmployee(updatedEmployee)}
                />
            )}
        </>
    );
};

export default Employee;
