import { useEffect, useState } from "react";
import { getUserById, updateUser } from "../../Services/Users";
import { Table, Button, Form, Card, Pagination, Badge } from "react-bootstrap";
import { UserCheck, UserX, Eye, ArrowLeft, User, Mail, Calendar } from "lucide-react";
import Profile from "../Employee/Profile";
import Attendance from "../Employee/Attendance";
import LeaveRequestsModal from "../Modals/LeaveRequestModal";

const Employees = ({ staff }) => {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [leaveFilter, setLeaveFilter] = useState("all");
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const employeesPerPage = 8;

    useEffect(() => {
        if (Array.isArray(staff) && staff.length > 0) {
            fetchEmployees();
        }
    }, [staff]);

    const fetchEmployees = async () => {
        try {
            const employeeList = await Promise.all(staff.map(id => getUserById(id, "employee")));
            setEmployees(employeeList.filter(emp => emp !== null && emp !== undefined));
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleLeaveAction = async (action, date) => {
        try {
            const updatedEmployee = { ...selectedEmployee };
            
            // Remove the date from leaveRequests
            updatedEmployee.leaveRequests = updatedEmployee.leaveRequests.filter(d => d !== date);
            
            // If approved, add to leaves array
            if (action === "approve") {
                updatedEmployee.leaves = [...(updatedEmployee.leaves || []), date];
            }
            
            // Update the employee data
            await updateUser(selectedEmployee.email, selectedEmployee.role, {
                leaveRequests: updatedEmployee.leaveRequests,
                leaves: updatedEmployee.leaves
            });
            
            // Update local state
            setSelectedEmployee(updatedEmployee);
            
            // Refresh the employee list
            fetchEmployees();
            
            // If no more leave requests, close the modal
            if (updatedEmployee.leaveRequests.length === 0) {
                setShowLeaveModal(false);
            }
        } catch (error) {
            console.error("Error handling leave action:", error);
        }
    };

    const filteredEmployees = employees.filter(emp => {
        const nameMatch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
        const lastSession = emp?.loginSessions?.[emp.loginSessions.length - 1];
        const isActive = lastSession?.loginTime?.startsWith(new Date().toISOString().split("T")[0]) && !lastSession?.logoutTime;
        const hasLeaveRequests = emp.leaveRequests && emp.leaveRequests.length > 0;
        
        // Status filter (active/inactive)
        let statusMatch = true;
        if (filter === "active") statusMatch = isActive;
        if (filter === "inactive") statusMatch = !isActive;
        
        // Leave requests filter
        let leaveMatch = true;
        if (leaveFilter === "requests") leaveMatch = hasLeaveRequests;
        if (leaveFilter === "no-requests") leaveMatch = !hasLeaveRequests;
        
        return nameMatch && statusMatch && leaveMatch;
    });

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleBack = () => {
        setSelectedProfile(null);
        setSelectedAttendance(null);
    };

    const openLeaveModal = (emp) => {
        setSelectedEmployee(emp);
        setShowLeaveModal(true);
    };

    return (
        <div className="container" style={{ marginLeft: "20px" }}>
            {/* Back button - always visible */}
            <div className="d-flex justify-content-start mb-3">
                <Button 
                    variant="success"
                    onClick={handleBack} 
                    className="shadow-sm" 
                    style={{ display: selectedProfile || selectedAttendance ? "block" : "none" }}
                >
                    <ArrowLeft size={18} className="me-2" /> Back
                </Button>
            </div>

            {selectedProfile && (
                <Profile employee={selectedProfile} />
            )}

            {selectedAttendance && (
                <Attendance loginSessions={selectedAttendance} />
            )}

            {!selectedProfile && !selectedAttendance && (
                <Card className="p-3 mb-3 shadow-sm">
                    <h3 className="mb-4 text-primary text-center fw-bold" style={{ fontFamily: "Arial, sans-serif" }}>
                        EMPLOYEES LIST
                    </h3>

                    <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                        <div className="flex-grow-1" style={{ minWidth: "150px" }}>
                            <Form.Control
                                type="text"
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-primary w-100"
                            />
                        </div>

                        <div style={{ width: "180px", flexShrink: 0 }}>
                            <Form.Select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="border-primary w-100"
                            >
                                <option value="all">All Employees</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                        </div>

                        <div style={{ width: "180px", flexShrink: 0 }}>
                            <Form.Select
                                value={leaveFilter}
                                onChange={(e) => setLeaveFilter(e.target.value)}
                                className="border-primary w-100"
                            >
                                <option value="all">All Requests</option>
                                <option value="requests">With Requests</option>
                                <option value="no-requests">No Requests</option>
                            </Form.Select>
                        </div>
                    </div>

                    <div className="table-responsive" style={{ maxHeight: "75vh", overflowY: "auto" }}>
                        <Table striped bordered hover responsive className="shadow-sm">
                            <thead className="table-dark text-center">
                                <tr>
                                    <th>EID</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>STATUS</th>
                                    <th>ATTENDANCE</th>
                                    <th>PROFILE</th>
                                    <th>LEAVES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEmployees.length > 0 ? (
                                    currentEmployees.map((emp) => {
                                        const lastSession = emp?.loginSessions?.[emp.loginSessions.length - 1];
                                        const isActive = lastSession?.loginTime?.startsWith(new Date().toISOString().split("T")[0]) && !lastSession?.logoutTime;
                                        const hasLeaveRequests = emp.leaveRequests && emp.leaveRequests.length > 0;

                                        return (
                                            <tr key={emp.id} className="text-center align-middle">
                                                <td>{emp.id}</td>
                                                <td className="text-uppercase">{emp.name}</td>
                                                <td>
                                                    <a href={`mailto:${emp.email}`} className="text-primary fw-bold text-decoration-none">
                                                        <Mail size={16} className="me-1" /> {emp.email}
                                                    </a>
                                                </td>
                                                <td className={isActive ? "text-success fw-bold" : "text-danger fw-bold"}>
                                                    {isActive ? <UserCheck size={18} className="me-2" /> : <UserX size={18} className="me-2" />}
                                                    {isActive ? "Active" : "Inactive"}
                                                </td>
                                                <td>
                                                    <Button variant="warning" className="text-dark fw-bold shadow-sm" onClick={() => setSelectedAttendance(emp.loginSessions)}>
                                                        <Eye size={16} className="me-1" /> Attendance
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button variant="info" className="text-white fw-bold shadow-sm" onClick={() => setSelectedProfile(emp)}>
                                                        <User size={16} className="me-1" /> Profile
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button 
                                                        variant={hasLeaveRequests ? "danger" : "secondary"} 
                                                        className="fw-bold shadow-sm" 
                                                        onClick={() => openLeaveModal(emp)}
                                                        disabled={!hasLeaveRequests}
                                                    >
                                                        <Calendar size={16} className="me-1" /> 
                                                        {hasLeaveRequests ? (
                                                            <>
                                                                Requests <Badge bg="light" text="dark" pill>{emp.leaveRequests.length}</Badge>
                                                            </>
                                                        ) : "No Requests"}
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted fw-bold">
                                            No Employees Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {filteredEmployees.length > employeesPerPage && (
                        <Pagination className="justify-content-center mt-3">
                            {[...Array(Math.ceil(filteredEmployees.length / employeesPerPage)).keys()].map((num) => (
                                <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => paginate(num + 1)}>
                                    {num + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    )}
                </Card>
            )}

            {/* Leave Requests Modal - now using the separate component */}
            <LeaveRequestsModal
                show={showLeaveModal}
                onHide={() => setShowLeaveModal(false)}
                employee={selectedEmployee}
                onLeaveAction={handleLeaveAction}
            />
        </div>
    );
};

export default Employees;