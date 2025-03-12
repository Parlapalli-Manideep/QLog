import React, { useState } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#F44336"]; 

const Home = ({ userData }) => {
    if (!userData?.loginSessions || userData.loginSessions.length === 0) {
        return <p className="text-center mt-4">No attendance records found.</p>;
    }

    const lastSession = userData.loginSessions[userData.loginSessions.length - 1];
    const lastLogin = parseTimestamp(lastSession?.loginTime);
    const lastLogout = parseTimestamp(lastSession?.logoutTime);

    const isToday = lastLogin && new Date().toDateString() === lastLogin.toDateString();
    const isActive = isToday && !lastLogout;

    const [selectedRange, setSelectedRange] = useState("1m"); 

    // Get Date Range for Filtering
    const now = new Date();
    let startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Default: This Month

    if (selectedRange === "3m") startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    else if (selectedRange === "6m") startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    else if (selectedRange === "1y") startDate = new Date(now.getFullYear() - 1, 0, 1);

    const filteredSessions = filterByDateRange(userData.loginSessions, startDate, now);

    let normalSessions = 0, otSessions = 0, earlyLogoutSessions = 0;
    filteredSessions.forEach((session) => {
        const loginTime = parseTimestamp(session.loginTime);
        const logoutTime = parseTimestamp(session.logoutTime);
        if (!loginTime || !logoutTime) return; 
        const { totalMinutes } = calculateDuration(loginTime, logoutTime);
        const { status } = getSessionStatus(totalMinutes);

        if (status === "Normal") normalSessions++;
        else if (status === "OT") otSessions++;
        else if (status === "Early Logout") earlyLogoutSessions++;
    });

    const pieData = [
        { name: "Normal", value: normalSessions },
        { name: "OT", value: otSessions },
        { name: "Early Logout", value: earlyLogoutSessions }
    ].filter((item) => item.value > 0); 

    return (
        <div className="container mt-4">
            <Row className="g-3">
                <Col md={4}>
                    <Card className="p-3 shadow-sm text-center custom-box">
                        <h6 className="fw-bold">Last Login</h6>
                        <p className="mb-0">{lastLogin ? lastLogin.toLocaleTimeString() : "No data"}</p>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-3 shadow-sm text-center custom-box">
                        <h6 className="fw-bold">Last Logout</h6>
                        <p className="mb-0">{lastLogout ? lastLogout.toLocaleTimeString() : "Active"}</p>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className={`p-3 shadow-sm text-center custom-box ${isActive ? "bg-success text-white" : "bg-light"}`}>
                        <h6 className="fw-bold">Status</h6>
                        <p className="mb-0 fw-bold">{isActive ? "Active" : "Inactive"}</p>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col md={6} className="d-flex">
                    <Card className="p-3 shadow-sm w-100 h-100">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Session Summary</h5>
                            <Form.Select 
                                value={selectedRange} 
                                onChange={(e) => setSelectedRange(e.target.value)}
                                className="w-auto"
                            >
                                <option value="1m">This Month</option>
                                <option value="3m">Last 3 Months</option>
                                <option value="6m">Last 6 Months</option>
                                <option value="1y">Last 1 Year</option>
                            </Form.Select>
                        </div>
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center text-muted mt-3">No data available</p>
                        )}
                    </Card>
                </Col>

                <Col md={6} className="d-flex">
                    <Card className="p-3 shadow-sm w-100 h-100">
                        <h5 className="text-center">Performance Overview</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total Sessions</span>
                                <strong>{normalSessions + otSessions + earlyLogoutSessions}</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Normal Sessions</span>
                                <strong>{normalSessions}</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Overtime (OT) Sessions</span>
                                <strong>{otSessions}</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Early Logout Sessions</span>
                                <strong>{earlyLogoutSessions}</strong>
                            </li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Home;
