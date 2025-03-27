import React, { useState, useMemo, useEffect } from "react";
import { Table, Pagination, Button, Dropdown, Row, Col, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { calculateWorkingHours, classifySession, filterSessions, formatDate, formatTime } from "../../Utils/AttendanceCalculations";
import DownloadTablePDF from "../Common/DownloadPdf";
import ModalComponent from "../Modals/ModalComponent";
import { Download } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getUserById } from "../../Services/Users";

const Attendance = ({ employeeId1 }) => {
    const location = useLocation();
    const [employeeId, setEmployeeId] = useState(null);
    const id = location.state?.id;

    useEffect(() => {
        setEmployeeId(id);
        if (employeeId1) {
            setEmployeeId(employeeId1);
        }
    }, [employeeId1, id]);

    const [loginSessions, setLoginSessions] = useState([]);
    useEffect(() => {
        const fetchEmployee = async () => {
            if (!employeeId) return;
            const employee = await getUserById(employeeId, "employee");
            setLoginSessions(employee?.loginSessions);
        }
        fetchEmployee();
    }, [employeeId]);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sessionType, setSessionType] = useState("All Sessions");
    const [currentPage, setCurrentPage] = useState(1);
    const [filterDates, setFilterDates] = useState({ startDate: null, endDate: null });
    const [showModal, setShowModal] = useState(false);

    const headers = ['Date', 'Login Time', 'Logout Time', 'Working Hours', 'Status']

    const applyDateFilter = () => {
        setFilterDates({ startDate, endDate });
    };

    const filteredSessions = useMemo(() => {
        if (!loginSessions) return [];
        setCurrentPage(1);
        return filterSessions(loginSessions, filterDates.startDate, filterDates.endDate, sessionType).reverse();
    }, [loginSessions, filterDates, sessionType, employeeId]);

    const totalPages = Math.ceil(filteredSessions.length / 10);
    const displayedSessions = filteredSessions.slice((currentPage - 1) * 10, currentPage * 10);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Early Logout":
                return { color: "red", fontWeight: "bold" };
            case "OT":
                return { color: "green", fontWeight: "bold" };
            default:
                return { color: "blue", fontWeight: "bold" };
        }
    };

    return (
        <Container fluid className="p-0">
            <div className="p-3 p-md-4 bg-white shadow-sm rounded">
                <div className="mb-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between p-2 p-md-3 shadow-sm"
                    style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                    <h4 className="mb-2 mb-md-0 fw-bold text-primary">
                        Employee Attendance Records
                    </h4>
                    <Button
                        variant="light"
                        className="d-flex align-items-center justify-content-center mt-2 mt-md-0"
                        onClick={() => setShowModal(true)}
                    >
                        <Download size={20} color="#333" className="me-2" />
                        <span className="fw-semibold">Download</span>
                    </Button>
                </div>

                <Row className="mb-3 g-2">
                    <Col xs={12} md={8} className="d-flex flex-column flex-sm-row gap-2">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            placeholderText="Start Date"
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            placeholderText="End Date"
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                        />
                        <Button
                            variant="primary"
                            onClick={applyDateFilter}
                            className="text-nowrap"
                        >
                            Check
                        </Button>
                    </Col>
                    <Col xs={12} md={4} className="d-flex justify-content-md-end">
                        <Dropdown className="w-md-auto">
                            <Dropdown.Toggle
                                variant="secondary"
                                className="w-100"
                                style={{ minWidth: "100px" }}
                            >
                                {sessionType}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100">
                                {["All Sessions", "Early Logout", "Normal", "OT"].map((type) => (
                                    <Dropdown.Item
                                        key={type}
                                        onClick={() => setSessionType(type)}
                                        style={{ color: type === "Early Logout" ? "red" : type === "OT" ? "green" : "blue" }}
                                    >
                                        {type}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>

                <div className="table-responsive">
                    <Table bordered striped hover className="text-center" id="AttendenceData">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Login Time</th>
                                <th>Logout Time</th>
                                <th>Working Hours</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedSessions.length > 0 ? (
                                displayedSessions.map(({ loginTime, logoutTime }, index) => {
                                    const status = classifySession(loginTime, logoutTime);
                                    return (
                                        <tr key={index}>
                                            <td>{formatDate(loginTime)}</td>
                                            <td>{formatTime(loginTime)}</td>
                                            <td>{logoutTime ? formatTime(logoutTime) : "—"}</td>
                                            <td>{calculateWorkingHours(loginTime, logoutTime)}</td>
                                            <td style={getStatusStyle(status)}>{status}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center fw-bold text-muted">
                                        No Logins
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="overflow-auto py-3">
                        <Pagination className="justify-content-center flex-wrap">
                            <Pagination.Prev
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            />

                            {(() => {
                                let pageNumbers = [];
                                if (totalPages <= 3) {
                                    pageNumbers = [...Array(totalPages)].map((_, idx) => idx + 1);
                                } else if (currentPage === 1) {
                                    pageNumbers = [1, 2, 3];
                                } else if (currentPage === totalPages) {
                                    pageNumbers = [totalPages - 2, totalPages - 1, totalPages];
                                } else {
                                    pageNumbers = [currentPage - 1, currentPage, currentPage + 1];
                                }

                                return pageNumbers.map((page) => (
                                    <Pagination.Item
                                        key={page}
                                        active={page === currentPage}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </Pagination.Item>
                                ));
                            })()}

                            <Pagination.Next
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </div>
                )}

                <ModalComponent
                    title="Confirm Download"
                    message="Are you sure you want to download the attendance report as a PDF?"
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={() => {
                        const generatePDF = DownloadTablePDF({ columns: headers, data: filteredSessions, fileName: "Attendance.pdf" });
                        generatePDF();
                        setShowModal(false);
                    }}
                />
            </div>
        </Container>
    );
};

export default Attendance;