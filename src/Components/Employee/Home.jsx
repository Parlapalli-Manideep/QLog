import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Mail, Shield, Clock, User, Calendar, AlertCircle } from "lucide-react";
import { getEmployeeLeaves } from "../../Services/Users";
import ApplyLeave from "./ApplyLeave";

const Home = ({ employee, manager }) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [existingLeaves, setExistingLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const today = React.useMemo(() => new Date(), []);
    const currentYear = today.getFullYear().toString();

    const loginSessions = employee?.LoginSessions || [];
    const lastSession = loginSessions.length > 0 ? loginSessions[loginSessions.length - 1] : null;
    const isActive = lastSession && !lastSession.logoutTime;

    const employeeDetails = [
        { label: "Employee ID", value: employee.id, icon: <User size={24} className="text-primary me-2" /> },
        { label: "Email", value: employee.email, icon: <Mail size={24} className="text-success me-2" /> },
        { label: "Role", value: employee.role, icon: <Shield size={24} className="text-purple me-2" /> },
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
                    const todayDate = today.toISOString().split('T')[0];
                    const filteredLeaves = (leavesData[currentYear] || []).filter(
                        date => date >= todayDate
                    );
                    setExistingLeaves(filteredLeaves);
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

    const handleLeaveApplied = (updatedLeaves, selectedDates) => {
        setSuccessMessage("Leave successfully applied for: " + selectedDates.join(", "));
        setExistingLeaves(updatedLeaves);
        setShowCalendar(false);

        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const handleCancel = () => {
        setShowCalendar(false);
    };

    return (
        <div style={{ margin: "85px auto auto 75px" }}>
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
                        <p className="fw-bold">{manager?.email || "N/A"}</p>
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

            {existingLeaves.length > 0 && (
                <div className="p-4 shadow-sm rounded bg-white w-100">
                    <h5 className="fw-semibold mb-3 fw-bold text-primary">Upcoming Leave Days</h5>
                    <div className="d-flex flex-wrap">
                        {existingLeaves
                            .filter(date => new Date(date) >= new Date(today.setHours(0, 0, 0, 0))) 
                            .sort((a, b) => new Date(a) - new Date(b))
                            .map(date => (
                                <span key={date} className="badge bg-primary me-2 mb-2 p-2">
                                    {new Date(date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;