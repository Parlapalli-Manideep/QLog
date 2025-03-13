import React, { useState, useMemo } from "react";
import { Table, Pagination, Button, Dropdown } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { calculateWorkingHours, classifySession, filterSessions } from "../../Utils/AttendanceCalculations";

const Attendance = ({ loginSessions }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sessionType, setSessionType] = useState("All Sessions");
    const [currentPage, setCurrentPage] = useState(1);
    const [filterDates, setFilterDates] = useState({ startDate: null, endDate: null });

    const applyDateFilter = () => {
        setFilterDates({ startDate, endDate });
    };
    
    const filteredSessions = useMemo(() => {
        return filterSessions(loginSessions, filterDates.startDate, filterDates.endDate, sessionType).reverse();
    }, [loginSessions, filterDates.startDate, filterDates.endDate, sessionType]);
    
    const totalPages = Math.ceil(filteredSessions.length / 10);
    const displayedSessions = filteredSessions.slice((currentPage - 1) * 10, currentPage * 10);

    const formatDate = (date) => {
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    };

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
        <div style={{ marginTop: "85px" }} className="p-4 bg-white shadow-sm rounded">

            <div className=" mb-3">
                <h4 className="mb-0 px-3 py-2"
                    style={{ backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
                    Employee Attendance Records
                </h4>
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
            <Table bordered striped hover className="text-center">
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

        </div>
    );
};

export default Attendance;
