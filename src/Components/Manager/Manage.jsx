import React, { useEffect, useState } from "react";
import { Table, Button, Form, Card, Pagination } from "react-bootstrap";
import { User, Trash2, ArrowLeft, Search } from "lucide-react";
import {
    getUserById,
    deleteEmployeeFromManager
} from "../../Services/Users";
import toast from "react-hot-toast";
import ModalComponent from "../Modals/ModalComponent";
import Profile from "../Employee/Profile";
import { useLocation } from "react-router-dom";

const Manage = () => {
    const [staff, setStaff] = useState([]);
    const [managerId, setManagerId] = useState(null);
    const id = useLocation().state?.id;
    useEffect(() => {
        const fetchStaff = async () => {
            const manager = await getUserById(id, "manager");
            setManagerId(manager.id);
            setStaff(manager.staff);
        }
        fetchStaff();
    },
        [id]);
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const employeesPerPage = 8;

    useEffect(() => {
        fetchEmployees();
    }, [staff, managerId]);

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
            console.log("Deleting employee:", employeeToDelete, managerId);
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
        <div className="container">
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
                    <Profile employeeId={selectedEmployee} />
                </>
            ) : (
                <Card className="shadow-sm">
                    <div className="p-3 p-md-4">
                        <h3 className="mb-3 mb-md-4 text-primary text-center fw-bold">
                            EMPLOYEE DIRECTORY
                        </h3>

                        <div className="mb-3">
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

                        <div className="table-responsive">
                            <Table bordered striped hover className="text-center">
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
                                                    <Button variant="info" className="text-white fw-bold shadow-sm" onClick={() => handleViewProfile(emp.id)}>
                                                        <User size={16} className="me-1" /> Profile
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button variant="danger" className="fw-bold shadow-sm" onClick={() => {
                                                        confirmDelete(emp)
                                                    }
                                                    }>
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
                    </div>
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