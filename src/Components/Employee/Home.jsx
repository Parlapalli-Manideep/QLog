import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Modal } from "react-bootstrap";
import { Mail, Shield, Clock, User, Calendar, QrCode } from "lucide-react";
import { getEmployeeLeaves, getUserById } from "../../Services/Users";
import ApplyLeave from "./ApplyLeave";
import QRCodeScanner from "../../Pages/Scanner/QRScanner";
import { useLocation } from "react-router-dom";

const EmployeeHome = () => {

    const location = useLocation();
    const [employee, setEmployee] = useState(null);
    const [manager, setManager] = useState(null);
    const [showQRScanner, setShowQRScanner] = useState(false);
    useEffect(() => {
        const fetchEmployee = async () => {
            const employeeData = await getUserById(location.state.id, "employee");
            setEmployee(employeeData);
        };
        fetchEmployee();
        const fetchManager = async () => {
            const managerData = await getUserById(employee?.managerId, "manager");
            setManager(managerData);
        };
        fetchManager();
    }, [location.state.id, employee?.managerId,showQRScanner]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [existingLeaves, setExistingLeaves] = useState([]);
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const today = React.useMemo(() => new Date(), []);
    const currentYear = today.getFullYear().toString();
    const loginSessions = employee?.loginSessions || [];
    const lastSession = loginSessions.length > 0 ? loginSessions[loginSessions.length - 1] : null;
    const isActive = lastSession && !lastSession.logoutTime;

    const employeeDetails = [
        { label: "Employee ID", value: employee?.id, icon: <User size={24} className="text-primary me-2" /> },
        { label: "Email", value: employee?.email, icon: <Mail size={24} className="text-success me-2" /> },
        { label: "Role", value: employee?.role, icon: <Shield size={24} className="text-purple me-2" /> },
        {
            label: "Status",
            value: isActive ? "Active" : "Inactive",
            icon: <Clock size={24} className="text-warning me-2" />,
            textColor: isActive ? "text-success" : "text-danger",
        },
    ];

    useEffect(() => {
        const fetchLeaves = async () => {
            if (employee?.id) {
                setIsLoading(true);
                try {
                    const leavesData = await getEmployeeLeaves(employee.id);

                    const filteredLeaves = (leavesData || []).filter(dateStr => {
                        const [year, month, day] = dateStr.split('-');

                        const leaveDate = new Date(year, month - 1, day);
                        return leaveDate > new Date(today.setHours(0, 0, 0, 0));
                    });
                    setExistingLeaves(filteredLeaves);

                    const pendingRequests = employee.leaveRequests || [];
                    const filteredPendingLeaves = pendingRequests.filter(dateStr => {
                        const [year, month, day] = dateStr.split('-');
                        const leaveDate = new Date(year, month - 1, day);
                        return leaveDate > new Date(today.setHours(0, 0, 0, 0));
                    });
                    setPendingLeaves(filteredPendingLeaves);
                } catch (error) {
                    console.error("Error fetching leaves:", error);
                    setErrorMessage("Failed to load existing leave data.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchLeaves();
    }, [employee?.id, currentYear, today]);

    const handleLeaveApplied = (updatedLeaveRequests, selectedDates) => {
        setSuccessMessage("Leave request submitted for: " + selectedDates.join(", "));
        setPendingLeaves(updatedLeaveRequests);
        setShowCalendar(false);

        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const handleCancel = () => {
        setShowCalendar(false);
    };

    const handleQRScannerClose = () => {
        setShowQRScanner(false);

    };

    return (
        <div style={{ marginLeft: "20px" }}>
            {successMessage && (
                <Alert variant="success" className="mb-4" onClose={() => setSuccessMessage("")} dismissible>
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert variant="danger" className="mb-4" onClose={() => setErrorMessage("")} dismissible>
                    {errorMessage}
                </Alert>
            )}

            <div className="p-4 shadow-sm rounded bg-white w-100 mb-4">
                <h5 className="fw-semibold mb-3 fw-bold text-primary">Employee Information</h5>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                    {employeeDetails.map((detail, index) => (
                        <div className="d-flex" style={{ flex: "1 1 250px", maxWidth: "300px" }} key={index}>
                            <Card className="p-3 shadow-sm bg-light w-100">
                                <div className="d-flex align-items-center">
                                    {detail.icon}
                                    <div className="ms-2 flex-grow-1 text-wrap">
                                        <p className="mb-1 fw-semibold">{detail.label}</p>
                                        <p className={`fw-bold ${detail.textColor || ""}`}>{detail.value}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 shadow-sm rounded bg-white w-100 mb-4">
                <h5 className="fw-semibold mb-3 fw-bold text-success">Quick Information</h5>
                <div className="d-flex flex-wrap gap-3">
                    <div className="p-3 shadow-sm rounded bg-light flex-grow-1">
                        <p className="text-muted mb-1">Manager Name</p>
                        <p className="fw-bold">{manager?.name || "N/A"}</p>
                    </div>

                    <div className="p-3 shadow-sm rounded bg-light flex-grow-1">
                        <p className="text-muted mb-1">Contact</p>
                        <p><a href={`mailto:${manager?.email}`} className="text-primary fw-bold text-decoration-none">{manager?.email || "N/A"}</a></p>
                    </div>
                </div>
            </div>

            <div className="p-4 shadow-sm rounded bg-white w-100 mb-4">
                <div className="d-flex align-items-center mb-3">
                    <QrCode className="me-2 text-primary" size={24} />
                    <h5 className="fw-semibold mb-0 fw-bold text-primary">Mark Attendance</h5>
                </div>

                <div className="p-3 shadow-sm rounded bg-light">
                    <div className="text-center">
                        <Button
                            variant="primary"
                            onClick={() => setShowQRScanner(true)}
                            className="px-4"
                        >
                            Scan QR Code
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4 shadow-sm rounded bg-white w-100 mb-4">
                <div className="d-flex align-items-center mb-3">
                    <Calendar className="me-2 text-primary" size={24} />
                    <h5 className="fw-semibold mb-0 fw-bold text-primary">Leave Management</h5>
                </div>

                <div className="p-3 shadow-sm rounded bg-light">
                    <div className="text-center">
                        {!showCalendar ? (
                            <Button
                                variant="primary"
                                onClick={() => setShowCalendar(true)}
                                disabled={isLoading}
                                className="px-4"
                            >
                                Apply for Leave
                            </Button>
                        ) : (
                            <ApplyLeave
                                employee={employee}
                                onLeaveApplied={handleLeaveApplied}
                                onCancel={handleCancel}
                            />
                        )}
                    </div>
                </div>
            </div>

            {pendingLeaves.length > 0 && (
                <div className="p-4 shadow-sm rounded bg-white w-100 mb-4">
                    <h5 className="fw-semibold mb-3 fw-bold text-warning">Pending Leave Requests</h5>
                    <div className="d-flex flex-wrap">
                        {pendingLeaves
                            .sort((a, b) => {
                                const [yearA, monthA, dayA] = a.split('-');
                                const [yearB, monthB, dayB] = b.split('-');
                                return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
                            })
                            .map(date => {
                                return (<span key={date} className="badge bg-warning text-dark me-2 mb-2 p-2">
                                    {date}
                                </span>)
                            })}
                    </div>
                </div>
            )}

            {existingLeaves.length > 0 && (
                <div className="p-4 shadow-sm rounded bg-white w-100">
                    <h5 className="fw-semibold mb-3 fw-bold text-success">Approved Leave Days</h5>
                    <div className="d-flex flex-wrap">
                        {existingLeaves
                            .sort((a, b) => {
                                const [yearA, monthA, dayA] = a.split('-');
                                const [yearB, monthB, dayB] = b.split('-');
                                return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
                            })
                            .map(date => (
                                <span key={date} className="badge bg-success me-2 mb-2 p-2">
                                    {date}
                                </span>
                            ))}
                    </div>
                </div>
            )}

            <Modal
                show={showQRScanner}
                onHide={handleQRScannerClose}
                centered
                backdrop="static"
                size="lg"
                contentClassName="bg-transparent border-0"
            >
                <Modal.Body className="p-0">
                    <div className="position-relative">
                        <div className="bg-white p-4 rounded shadow">
                            <button
                                type="button"
                                className="btn-close position-absolute"
                                style={{ top: "15px", right: "15px" }}
                                onClick={handleQRScannerClose}
                                aria-label="Close"
                            ></button>
                            <QRCodeScanner />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default EmployeeHome;