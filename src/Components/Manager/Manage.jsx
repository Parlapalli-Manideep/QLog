import React, { useEffect, useState } from "react";
import { Table, Button, Form, Card, Pagination } from "react-bootstrap";
import { User, Trash2, ArrowLeft, Search } from "lucide-react";
import { 
    getUserById, 
    getManagers,
    deleteEmployeeFromManager 
} from "../../Services/Users";
import toast from "react-hot-toast";
import ModalComponent from "../Modals/ModalComponent";
import Profile from "../Employee/Profile";

const Manage = ({ managerId, staff = [] }) => {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
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

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); 
    };

    const filteredEmployees = employees.filter(emp => {
        const nameMatch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
        const idMatch = emp.id.toString().includes(searchQuery);
        return nameMatch || idMatch;
    });

    const handleViewProfile = (employee) => {
        setSelectedEmployee(employee);
    };

    const handleBack = () => {
        setSelectedEmployee(null);
    };

    const confirmDelete = (employee) => {
        setEmployeeToDelete(employee);
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            if (!employeeToDelete || !managerId) {
                console.error("Missing employee or manager information");
                return;
            }
            
            await deleteEmployeeFromManager(managerId, employeeToDelete.id);
            
            setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
            setShowModal(false);
            setEmployeeToDelete(null);
            
            toast.success(`Employee ${employeeToDelete.name} deleted successfully`);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error deleting employee:", error.message);
            toast.error(error.message || "Error deleting employee");
        }
    };

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <div className="container" style={{ marginLeft: "20px" }}>
            {selectedEmployee ? (
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
                            <ArrowLeft size={18} className="me-2" /> Back to Directory
                        </button>
                    </div>
                    <Profile employee={selectedEmployee} />
                </>
            ) : (
                <Card className="p-3 mb-3 shadow-sm">
                    <h3 className="mb-4 text-primary text-center fw-bold" style={{ fontFamily: "Arial, sans-serif" }}>
                        EMPLOYEE DIRECTORY
                    </h3>

                    <div className="mb-4">
                        <div className="input-group">
                            <span className="input-group-text bg-primary text-white">
                                <Search size={18} />
                            </span>
                            <Form.Control
                                type="text"
                                placeholder="Search by name or employee ID..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="border-primary"
                            />
                        </div>
                    </div>

                    <div className="table-responsive" style={{ maxHeight: "75vh", overflowY: "auto" }}>
                        <Table striped bordered hover responsive className="shadow-sm">
                            <thead className="table-dark text-center">
                                <tr>
                                    <th>EID</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>PROFILE</th>
                                    <th>DELETE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEmployees.length > 0 ? (
                                    currentEmployees.map((emp) => (
                                        <tr key={emp.id} className="text-center align-middle">
                                            <td>{emp.id}</td>
                                            <td className="text-uppercase">{emp.name}</td>
                                            <td>
                                                <a href={`mailto:${emp.email}`} className="text-primary fw-bold text-decoration-none">
                                                    {emp.email}
                                                </a>
                                            </td>
                                            <td>
                                                <Button variant="info" className="text-white fw-bold shadow-sm" onClick={() => handleViewProfile(emp)}>
                                                    <User size={16} className="me-1" /> Profile
                                                </Button>
                                            </td>
                                            <td>
                                                <Button variant="danger" className="fw-bold shadow-sm" onClick={() => confirmDelete(emp)}>
                                                    <Trash2 size={16} className="me-1" /> Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted fw-bold">
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

            <ModalComponent
                title="Confirm Deletion"
                message={`Are you sure you want to delete employee "${employeeToDelete?.name}"? This action cannot be undone.`}
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default Manage;