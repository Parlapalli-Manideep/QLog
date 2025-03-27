import { useEffect, useState } from "react";
import { getUserById, updateUser } from "../../Services/Users";
import { Table, Button, Form, Card, Pagination, Badge } from "react-bootstrap";
import { UserCheck, UserX, Eye, ArrowLeft, Calendar } from "lucide-react";
import Attendance from "../Employee/Attendance";
import LeaveRequestsModal from "../Modals/LeaveRequestModal";
import { useLocation } from "react-router-dom";

const EmployeeManagement = () => {
    const [staff, setStaff] = useState([]);
    const id = useLocation().state?.id;
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [leaveFilter, setLeaveFilter] = useState("all");
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const employeesPerPage = 8;
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const employee = await getUserById(id, "manager");
                setStaff(employee.staff);
            } catch (error) {
                console.error("Error fetching staff:", error);
            }
        };
        fetchStaff();
    }, [id]);
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

            updatedEmployee.leaveRequests = updatedEmployee.leaveRequests.filter(d => d !== date);

            if (action === "approve") {
                updatedEmployee.leaves = [...(updatedEmployee.leaves || []), date];
            }

            await updateUser(selectedEmployee.email, selectedEmployee.role, {
                leaveRequests: updatedEmployee.leaveRequests,
                leaves: updatedEmployee.leaves
            });

            setSelectedEmployee(updatedEmployee);

            fetchEmployees();

            if (updatedEmployee.leaveRequests.length === 0) {
                setShowLeaveModal(false);
            }
        } catch (error) {
            console.error("Error handling leave action:", error);
        }
    };

    const filteredEmployees = employees.filter(emp => {
        const searchMatch =
            emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.id.toString().includes(searchQuery);

        const lastSession = emp?.loginSessions?.[emp.loginSessions.length - 1];
        const isActive = lastSession?.loginTime?.startsWith(new Date().toISOString().split("T")[0]) && !lastSession?.logoutTime;
        const hasLeaveRequests = emp.leaveRequests && emp.leaveRequests.length > 0;

        let statusMatch = true;
        if (filter === "active") statusMatch = isActive;
        if (filter === "inactive") statusMatch = !isActive;

        let leaveMatch = true;
        if (leaveFilter === "requests") leaveMatch = hasLeaveRequests;
        if (leaveFilter === "no-requests") leaveMatch = !hasLeaveRequests;

        return searchMatch && statusMatch && leaveMatch;
    });

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleBack = () => {
        setSelectedAttendance(null);
    };

    const openLeaveModal = (emp) => {
        setSelectedEmployee(emp);
        setShowLeaveModal(true);
    };

    const backButtonStyle = {
        transition: "all 0.3s ease",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "4px",
        padding: "8px 16px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        cursor: "pointer"
    };

    return (
        <div className="container">
            {selectedAttendance ? (
                <>
                    <div className="mb-4 mt-2">
                        <button
                            className="btn btn-light shadow-sm"
                            onClick={handleBack}
                            style={backButtonStyle}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#e9ecef";
                                e.currentTarget.style.borderColor = "#ced4da";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "#f8f9fa";
                                e.currentTarget.style.borderColor = "#dee2e6";
                            }}
                            onMouseDown={(e) => {
                                e.currentTarget.style.backgroundColor = "#dde0e3";
                                e.currentTarget.style.transform = "scale(0.98)";
                            }}
                            onMouseUp={(e) => {
                                e.currentTarget.style.backgroundColor = "#e9ecef";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            <ArrowLeft size={18} className="me-2" /> Back to Employees
                        </button>
                    </div>
                    <Attendance employeeId1={selectedAttendance} />
                </>
            ) : (
                <Card className="shadow-sm">
                    <div className="p-3 p-md-4">
                        <h3 className="mb-3 mb-md-4 text-primary text-center fw-bold">
                            EMPLOYEES LIST
                        </h3>

                        <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 mb-3">
                            <div className="flex-grow-1">
                                <Form.Control
                                    type="text"
                                    placeholder="Search by name or employee ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border-primary w-100"
                                />
                            </div>

                            <div className="d-flex flex-column flex-sm-row gap-2">
                                <Form.Select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="border-primary"
                                >
                                    <option value="all">All Employees</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Form.Select>

                                <Form.Select
                                    value={leaveFilter}
                                    onChange={(e) => setLeaveFilter(e.target.value)}
                                    className="border-primary"
                                >
                                    <option value="all">All Requests</option>
                                    <option value="requests">With Requests</option>
                                    <option value="no-requests">No Requests</option>
                                </Form.Select>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <Table bordered striped hover className="text-center table-sm">
                                <thead className="table-dark text-center">
                                    <tr>
                                        <th>EID</th>
                                        <th>NAME</th>
                                        <th>EMAIL</th>
                                        <th>STATUS</th>
                                        <th>ATTENDANCE</th>
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
                                                            {emp.email}
                                                        </a>
                                                    </td>
                                                    <td className={isActive ? "text-success fw-bold" : "text-danger fw-bold"}>
                                                        {isActive ? <UserCheck size={18} className="me-2" /> : <UserX size={18} className="me-2" />}
                                                        {isActive ? "Active" : "Inactive"}
                                                    </td>
                                                    <td>
                                                        <Button variant="warning" className="text-dark fw-bold shadow-sm" onClick={() => setSelectedAttendance(emp.id)}>
                                                            <Eye size={16} className="me-1" /> Attendance
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant={hasLeaveRequests ? "danger" : "secondary"}
                                                            className="fw-bold shadow-sm position-relative"
                                                            onClick={() => openLeaveModal(emp)}
                                                            disabled={!hasLeaveRequests}
                                                        >
                                                            <Calendar size={16} className="me-1" />
                                                            {hasLeaveRequests ? (
                                                                <>
                                                                    Requests
                                                                    <Badge
                                                                        bg="light"
                                                                        text="dark"
                                                                        className="position-absolute top-0 start-90 translate-middle badge rounded-pill"
                                                                    >
                                                                        {emp.leaveRequests.length}</Badge>
                                                                </>
                                                            ) : "No Requests"}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center text-muted fw-bold">
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
                    </div>
                </Card>
            )}

            <LeaveRequestsModal
                show={showLeaveModal}
                onHide={() => setShowLeaveModal(false)}
                employee={selectedEmployee}
                onLeaveAction={handleLeaveAction}
            />
        </div>
    );
};

export default EmployeeManagement;