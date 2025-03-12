import React, { useState, useEffect } from "react";
import { Table, Pagination, Form, Row, Col, Container, Card, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Attendance({ userData }) {
    const recordsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filterType, setFilterType] = useState("all");
    const [filteredSessions, setFilteredSessions] = useState(userData?.loginSessions || []);
    const [dateFilteredSessions, setDateFilteredSessions] = useState(userData?.loginSessions || []);
    const [isFiltered, setIsFiltered] = useState(false);

    if (!userData?.loginSessions || userData.loginSessions.length === 0) {
        return <p className="text-center mt-4">No attendance records found.</p>;
    }

    const parseTimestamp = (timestamp) => {
        if (!timestamp) return null;
        const ts = parseInt(timestamp);
        return ts.toString().length === 10 ? new Date(ts * 1000) : new Date(ts);
    };

    const normalizeDate = (date) => (date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : null);

    const applyDateFilter = () => {
        const normalizedStart = normalizeDate(startDate);
        const normalizedEnd = normalizeDate(endDate);

        let sessions = userData.loginSessions.filter((session) => {
            const loginDate = normalizeDate(parseTimestamp(session.loginTime));
            return (!normalizedStart || loginDate >= normalizedStart) && (!normalizedEnd || loginDate <= normalizedEnd);
        });

        setIsFiltered(true);
        setDateFilteredSessions(sessions);
        applySessionTypeFilter(sessions, filterType);
    };

    const resetFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setIsFiltered(false);
        setDateFilteredSessions(userData.loginSessions);
        applySessionTypeFilter(userData.loginSessions, filterType);
    };

    useEffect(() => {
        applySessionTypeFilter(dateFilteredSessions, filterType);
    }, [filterType]);

    const applySessionTypeFilter = (sessions, type) => {
        let filtered = sessions.filter((session) => {
            const loginTime = parseTimestamp(session.loginTime);
            const logoutTime = parseTimestamp(session.logoutTime);
            if (!loginTime || !logoutTime) return false;

            const durationMs = logoutTime - loginTime;
            const totalMinutes = Math.floor(durationMs / (1000 * 60));

            if (type === "normal") return totalMinutes >= 480 && totalMinutes <= 510;
            if (type === "ot") return totalMinutes > 510;
            if (type === "early") return totalMinutes < 480;
            return true;
        });

        setFilteredSessions(filtered);
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

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        let pages = [];
        let start = Math.max(1, currentPage - 1);
        let end = Math.min(totalPages, currentPage + 1);

        if (currentPage === 1) {
            end = Math.min(3, totalPages);
        } else if (currentPage === totalPages) {
            start = Math.max(1, totalPages - 2);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <Pagination.Item key={i} active={i === currentPage} onClick={() => paginate(i)}>
                    {i}
                </Pagination.Item>
            );
        }

        return (
            <Pagination className="justify-content-center mt-3">
                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                {pages}
                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
        );
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
                            <Button variant={isFiltered ? "danger" : "primary"} onClick={isFiltered ? resetFilters : applyDateFilter}>
                                {isFiltered ? "Reset" : "Check"}
                            </Button>
                        </Col>
                        <Col xs="auto" className="ms-auto">
                            <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-auto">
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
                                    if (!loginTime || !logoutTime) return null;

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
                                            <td>{loginTime.toLocaleDateString("en-GB")}</td>
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
            {renderPagination()}
        </Container>
    );
}

export default Attendance;