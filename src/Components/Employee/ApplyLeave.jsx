import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { AlertCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateUser, getEmployeeLeaves } from "../../Services/Users";

const ApplyLeave = ({ employee, onLeaveApplied, onCancel }) => {
    const [selectedDates, setSelectedDates] = useState([]);
    const [existingLeaves, setExistingLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 1);
    const currentYear = new Date().getFullYear().toString();

    React.useEffect(() => {
        const fetchLeaves = async () => {
            if (employee?.id) {
                setIsLoading(true);
                try {
                    const leavesData = await getEmployeeLeaves(employee.id);
                    setExistingLeaves(leavesData[currentYear] || []);
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
        const formattedDate = date.toLocaleDateString("en-CA"); // "YYYY-MM-DD" format in local timezone

        if (existingLeaves.includes(formattedDate)) {
            setErrorMessage("This date already has an approved leave.");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        setSelectedDates((prevDates) => {
            if (prevDates.includes(formattedDate)) {
                return prevDates.filter((d) => d !== formattedDate);
            } else if (prevDates.length < 2) {
                return [...prevDates, formattedDate];
            } else {
                setErrorMessage("You can only select up to two leave dates. Please contact your manager for additional leave requests.");
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
            const leavesData = await getEmployeeLeaves(employee.id);
            
            if (!leavesData[currentYear]) {
                leavesData[currentYear] = [];
            }
            
            const yearLeaves = leavesData[currentYear];
    
            if (yearLeaves.length >= 15) {
                setErrorMessage("You have already used the maximum of 15 leave days.");
                setIsLoading(false);
                return;
            }
    
            if (yearLeaves.length + selectedDates.length > 15) {
                setErrorMessage(`You can only select ${15 - yearLeaves.length} more leave day(s).`);
                setIsLoading(false);
                return;
            }
    
            const updatedYearLeaves = [...yearLeaves, ...selectedDates].sort();
            
            const updatedLeaves = {
                ...leavesData,
                [currentYear]: updatedYearLeaves
            };
    
            const updatedUser = await updateUser(employee.email, "employee", { 
                Leaves: updatedLeaves 
            });
    
            if (updatedUser) {
                onLeaveApplied(updatedYearLeaves, selectedDates);
            } else {
                setErrorMessage("Failed to update leave information. Please try again.");
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
            
            <p className="text-muted mb-2">
                <small>
                    <AlertCircle size={16} className="me-1" />
                    Select up to 2 dates. Dates with existing leave are disabled.
                </small>
            </p>
            
            <DatePicker
                selected={null}
                onChange={toggleDateSelection}
                inline
                minDate={minDate}
                maxDate={maxDate}
                highlightDates={selectedDates.map(date => new Date(date))}
                filterDate={date => {
                    // Disable only weekends and dates that are already in existing leaves
                    const formattedDate = date.toLocaleDateString("en-CA");
                    const day = date.getDay();
                    return day !== 0 && day !== 6 && !existingLeaves.includes(formattedDate);
                }}
                dayClassName={(date) =>
                    selectedDates.includes(date.toLocaleDateString("en-CA"))
                        ? "bg-primary text-white rounded"
                        : ""
                }
            />

            {selectedDates.length > 0 && (
                <div className="mt-2 mb-3">
                    <p className="mb-1">Selected dates:</p>
                    <ul className="list-unstyled d-flex flex-wrap">
                        {selectedDates.map(date => (
                            <li key={date} className="badge bg-light text-dark me-2 p-2 mb-2">
                                {new Date(date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </li>
                        ))}
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