import React, { useState, useMemo } from "react";
import { Table, Pagination, Button, Dropdown } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { calculateWorkingHours, classifySession, filterSessions, formatDate, formatTime } from "../../Utils/AttendanceCalculations";
import DownloadTablePDF from "../Common/DownloadPdf";
import ModalComponent from "../Modals/ModalComponent";
import { Download } from "lucide-react";

const Attendance = ({ loginSessions }) => {
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
        setCurrentPage(1);
        return filterSessions(loginSessions, filterDates.startDate, filterDates.endDate, sessionType).reverse();
    }, [loginSessions, filterDates, sessionType]);



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
        <div style={{ marginTop: "85px auto auto 75px" }} className="p-4 bg-white shadow-sm rounded">

            <div className="mb-3 d-flex align-items-center justify-content-between p-3 shadow-sm"
                style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>

                <h4 className="mb-0 fw-bold text-primary">
                    Employee Attendance Records
                </h4>

                <Button variant="light" className="d-flex align-items-center" onClick={() => setShowModal(true)}>
                    <Download size={24} color="#333" className="me-2" />
                    <span className="fw-semibold">Download</span>
                </Button>
            </div>


            <div className="d-flex justify-content-between mb-3">
                <div className="d-flex gap-2">
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
                    <Button variant="primary" onClick={applyDateFilter}>Check</Button>
                </div>
                <Dropdown>
                    <Dropdown.Toggle variant="secondary" style={{ width: "150px" }}>{sessionType}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {["All Sessions", "Early Logout", "Normal", "OT"].map((type) => (
                            <Dropdown.Item key={type} onClick={() => setSessionType(type)} style={{ color: type === "Early Logout" ? "red" : type === "OT" ? "green" : "blue" }}>
                                {type}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Table */}
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
                    {displayedSessions.map(({ loginTime, logoutTime }, index) => {
                        const status = classifySession(loginTime, logoutTime);
                        return (
                            <tr key={index}>
                                <td>{formatDate(loginTime)}</td>
                                <td>{formatTime(loginTime)}</td>
                                <td>{formatTime(logoutTime)}</td>
                                <td>{calculateWorkingHours(loginTime, logoutTime)}</td>
                                <td style={getStatusStyle(status)}>{status}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <Pagination className="justify-content-center">
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
    );
};

export default Attendance;
