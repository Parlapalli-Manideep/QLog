import React, { useState } from "react";
import { Table, Pagination, Form, Row, Col, Container, Card, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Attendance({ userData }) {
    const recordsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filteredSessions, setFilteredSessions] = useState(userData?.loginSessions || []);
    const [filterType, setFilterType] = useState("all");

    if (!userData?.loginSessions || userData.loginSessions.length === 0) {
        return <p className="text-center mt-4">No attendance records found.</p>;
    }

    const parseTimestamp = (timestamp) => {
        const ts = parseInt(timestamp);
        return ts.toString().length === 10 ? new Date(ts * 1000) : new Date(ts);
    };

    const normalizeDate = (date) => date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : null;

    const applyDateFilter = () => {
        let sessions = userData.loginSessions;
        const normalizedStart = normalizeDate(startDate);
        const normalizedEnd = normalizeDate(endDate);

        sessions = sessions.filter((session) => {
            const loginDate = normalizeDate(parseTimestamp(session.loginTime));
            return (!normalizedStart || loginDate >= normalizedStart) && (!normalizedEnd || loginDate <= normalizedEnd);
        });

        setFilteredSessions(sessions);
        setCurrentPage(1);
    };

    const handleFilterTypeChange = (type) => {
        setFilterType(type);
        let sessions = userData.loginSessions.filter((session) => {
            const loginTime = parseTimestamp(session.loginTime);
            const logoutTime = parseTimestamp(session.logoutTime);
            const durationMs = logoutTime - loginTime;
            const totalMinutes = Math.floor(durationMs / (1000 * 60));

            if (type === "normal") return totalMinutes >= 480 && totalMinutes <= 510;
            if (type === "ot") return totalMinutes > 510;
            if (type === "early") return totalMinutes < 480;
            return true;
        });

        setFilteredSessions(sessions);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredSessions.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredSessions.slice(indexOfFirstRecord, indexOfLastRecord);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const getPaginationRange = () => {
        let start = Math.max(1, currentPage - 1);
        let end = Math.min(totalPages, start + 2);
        if (end - start < 2) start = Math.max(1, end - 2);
        return [...Array(end - start + 1)].map((_, i) => start + i);
    };

    return (
        <Container className="mt-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Attendance Records</h5>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3 g-2 align-items-center">
                        <Col xs="auto">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="form-control"
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Start Date"
                            />
                        </Col>
                        <Col xs="auto">
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                className="form-control"
                                dateFormat="dd/MM/yyyy"
                                placeholderText="End Date"
                            />
                        </Col>
                        <Col xs="auto">
                            <Button variant="primary" onClick={applyDateFilter}>Check</Button>
                        </Col>
                        <Col xs="auto" className="ms-auto">
                            <Form.Select 
                                value={filterType} 
                                onChange={(e) => handleFilterTypeChange(e.target.value)} 
                                className="w-auto"
                            >
                                <option value="all">All</option>
                                <option value="normal">Normal</option>
                                <option value="ot">OT</option>
                                <option value="early">Early Logout</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    <Table responsive striped bordered hover className="text-center">
                        <thead className="table-dark">
                            <tr>
                                <th>Date</th>
                                <th>Login Time</th>
                                <th>Logout Time</th>
                                <th>Session Duration</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.length > 0 ? (
                                currentRecords.map((session, index) => {
                                    const loginTime = parseTimestamp(session.loginTime);
                                    const logoutTime = parseTimestamp(session.logoutTime);
                                    const durationMs = logoutTime - loginTime;
                                    const hours = Math.floor(durationMs / (1000 * 60 * 60));
                                    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                                    const totalMinutes = hours * 60 + minutes;

                                    let statusClass = "text-danger";
                                    let status = "Early Logout";
                                    if (totalMinutes >= 480 && totalMinutes <= 510) {
                                        status = "Normal";
                                        statusClass = "text-success";
                                    } else if (totalMinutes > 510) {
                                        status = "OT";
                                        statusClass = "text-primary";
                                    }

                                    return (
                                        <tr key={index}>
                                            <td>{loginTime.toLocaleDateString("en-GB")}</td> {/* DD/MM/YYYY */}
                                            <td>{loginTime.toLocaleTimeString()}</td>
                                            <td>{logoutTime.toLocaleTimeString()}</td>
                                            <td>{`${hours}h ${minutes}m`}</td>
                                            <td className={statusClass}><strong>{status}</strong></td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                    <Pagination.Prev 
                        onClick={() => paginate(currentPage - 1)} 
                        disabled={currentPage === 1}
                    />
                    {getPaginationRange().map((page) => (
                        <Pagination.Item 
                            key={page} 
                            active={page === currentPage} 
                            onClick={() => paginate(page)}
                        >
                            {page}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next 
                        onClick={() => paginate(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            )}
        </Container>
    );
}

export default Attendance;
