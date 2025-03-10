import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserData } from "../../Services/Users";
import { Modal, Button } from "react-bootstrap";
import { QrCode } from "lucide-react";
import ManagerIdHandler from "../../Components/Employee/ManagerIdHandler";
import EmployeeHeader from "../../Components/Employee/EmployeeHeader";
import Home from "../../Components/Employee/Home";
import Attendance from "../../Components/Employee/Attendance"; 
import Sidebar from "../../Components/Employee/SideBar";

function Employee() {
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [activeSection, setActiveSection] = useState("home"); // Default: Home
    const userEmail = location.state?.email || "";
    const [needsManagerId, setNeedsManagerId] = useState(false);

    useEffect(() => {
        if (userEmail) {
            fetchEmployeeDetails(userEmail);
        }
    }, [userEmail]);

    const fetchEmployeeDetails = async (userEmail) => {
        let data = await getUserData(userEmail);
        if (data) {
            if (!data.managerId) {
                setNeedsManagerId(true);
            } else {
                setUserData(data);
            }
        }
    };

    const handleManagerIdSet = (updatedUser) => {
        setNeedsManagerId(false);
        setUserData(updatedUser);
    };

    const handleLogout = () => {
        window.location.href = "/login"; 
    };

    return (
        <div className="d-flex">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

            <div className="flex-grow-1 p-4">
                {needsManagerId && <ManagerIdHandler userEmail={userEmail} onManagerIdSet={handleManagerIdSet} />}

                {userData && (
                    <EmployeeHeader
                        userData={userData}
                        onShowQR={() => setShowQR(true)}
                        onLogout={handleLogout}
                    />
                )}

                <div className="mt-5">
                    {activeSection === "home" && <Home userData={userData} />}
                    {activeSection === "attendance" && <Attendance userData={userData} />}
                </div>
            </div>

            <Modal show={showQR} onHide={() => setShowQR(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>QR Code</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {userData?.qrCode && <QrCode value={userData.qrCode} size={200} />}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowQR(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Employee;
