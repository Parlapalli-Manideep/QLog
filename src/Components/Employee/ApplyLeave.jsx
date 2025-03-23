import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { AlertCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateUser } from "../../Services/Users";

const ApplyLeave = ({ employee, onLeaveApplied, onCancel }) => {
    const [selectedDates, setSelectedDates] = useState([]);
    const [existingLeaves, setExistingLeaves] = useState([]);
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);
    
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 3);
    
    const currentYear = new Date().getFullYear().toString();

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    React.useEffect(() => {
        const fetchLeaves = async () => {
            if (employee?.id) {
                setIsLoading(true);
                try {
                    const leavesData = employee.leaves || {};
                    setExistingLeaves(leavesData || []);
                    
                    const pendingRequests = employee.leaveRequests || [];
                    setPendingLeaves(pendingRequests);
                } catch (error) {
                    console.error("Error fetching leaves:", error);
                    setErrorMessage("Failed to load existing leave data.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchLeaves();
    }, [employee?.id]);

    const toggleDateSelection = (date) => {
        const formattedDate = formatDate(date);

        if (existingLeaves.includes(formattedDate)) {
            setErrorMessage("This date already has an approved leave.");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        if (pendingLeaves.includes(formattedDate)) {
            setErrorMessage("This date already has a pending leave request.");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        setSelectedDates((prevDates) => {
            if (prevDates.includes(formattedDate)) {
                return prevDates.filter((d) => d !== formattedDate);
            } else if (prevDates.length < 5) { 
                return [...prevDates, formattedDate].sort();
            } else {
                setErrorMessage("You can only select up to five leave dates. Please contact your manager for additional leave requests.");
                setTimeout(() => setErrorMessage(""), 3000);
                return prevDates;
            }
        });
    };

    const applyLeave = async () => {
        if (selectedDates.length === 0) {
            setErrorMessage("Please select at least one date to apply for leave.");
            return;
        }
    
        setIsLoading(true);
        try {
            const yearLeaves = employee.leaves?.[currentYear] || [];
            const currentPendingLeaves = employee.leaveRequests || [];
            const totalPendingAndApproved = yearLeaves.length + currentPendingLeaves.length;
    
            if (totalPendingAndApproved + selectedDates.length > 15) {
                setErrorMessage(`You can only select ${15 - totalPendingAndApproved} more leave day(s).`);
                setIsLoading(false);
                return;
            }
    
            const updatedLeaveRequests = [...new Set([...currentPendingLeaves, ...selectedDates])].sort();
    
            const updatedUser = await updateUser(employee.email, "employee", { 
                ...employee,
                leaveRequests: updatedLeaveRequests 
            });
    
            if (updatedUser) {
                setSuccessMessage("Leave request submitted successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
                onLeaveApplied(updatedLeaveRequests, selectedDates); 
            } else {
                setErrorMessage("Failed to submit leave request. Please try again.");
            }
        } catch (error) {
            console.error("Error applying leave:", error);
            setErrorMessage("Failed to apply for leave. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-white p-3 shadow rounded">
            {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
                    {errorMessage}
                </Alert>
            )}
            
            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
                    {successMessage}
                </Alert>
            )}
            
            <p className="text-muted mb-2">
                <small>
                    <AlertCircle size={16} className="me-1" />
                    Select up to 5 dates. Dates with existing leave are disabled.
                </small>
            </p>
            
            <DatePicker
                selected={null}
                onChange={toggleDateSelection}
                inline
                minDate={minDate}
                maxDate={maxDate}
                highlightDates={selectedDates.map(date => new Date(date))}
            
                filterDate={(date) => {
                    const formattedDate = formatDate(date);
                    const day = date.getDay();
                    return (
                        day !== 0 &&
                        !existingLeaves.includes(formattedDate) && 
                        !pendingLeaves.includes(formattedDate)
                    );
                }}
                
                dayClassName={(date) => {
                    const formattedDate = formatDate(date);
                    return selectedDates.includes(formattedDate)
                        ? "bg-primary text-white rounded"
                        : "";
                }}
                style={{ fontSize: "10px", width: "220px" }} 
            />

            {selectedDates.length > 0 && (
                <div className="mt-2 mb-3">
                    <p className="mb-1">Selected dates:</p>
                    <ul className="list-unstyled d-flex flex-wrap">
                        {selectedDates.map(date => {
                            const displayDate = new Date(date);
                            return (
                                <li key={date} className="badge bg-light text-dark me-2 p-2 mb-2">
                                    {displayDate.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <div className="d-flex justify-content-between mt-3">
                <Button
                    variant="outline-secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={applyLeave}
                    disabled={isLoading || selectedDates.length === 0}
                >
                    {isLoading ? "Processing..." : "Submit Leave Request"}
                </Button>
            </div>
        </div>
    );
};

export default ApplyLeave;