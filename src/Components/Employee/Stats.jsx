import React, { useState } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#2196F3"];

const parseTimestamp = (timestamp) => (timestamp ? new Date(timestamp) : null);

const getWorkingDays = (startDate, endDate) => {
    let workingDays = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        if (currentDate.getDay() !== 0) { // Exclude Sundays
            workingDays.push(currentDate.toISOString().split("T")[0]);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return workingDays;
};

const Stats = ({ loginSessions, leaves }) => {
    if (!loginSessions || loginSessions.length === 0) {
        return <p className="text-center mt-4">No attendance records found.</p>;
    }

    const firstLoginDate = parseTimestamp(loginSessions[0].loginTime);
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]; // Format today's date as YYYY-MM-DD

    const [selectedRange, setSelectedRange] = useState("all");
    let startDate = firstLoginDate;

    if (selectedRange === "1m") startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (selectedRange === "3m") startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    else if (selectedRange === "6m") startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    else if (selectedRange === "1y") startDate = new Date(now.getFullYear() - 1, 0, 1);
    
    if (startDate < firstLoginDate) {
        startDate = firstLoginDate;
    }

    const workingDays = getWorkingDays(startDate, now);
    const presentDays = new Set(
        loginSessions.map(session => session.loginTime.split("T")[0])
    );
    
    const leaveDays = new Set(leaves[now.getFullYear()] || []);
    
    let totalLeaves = 0, totalAbsents = 0, totalPresents = 0;

    workingDays.forEach(day => {
        if (presentDays.has(day)) {
            totalPresents++;
        } else if (leaveDays.has(day)) {
            totalLeaves++;
        } else {
            totalAbsents++;
        }
    });

    const totalWorkingDays = workingDays.length;
    const attendanceData = [
        { name: "Present", value: totalPresents },
        { name: "Leaves", value: totalLeaves },
        { name: "Absents", value: totalAbsents }
    ];

    return (
        <div className="container" style={{ marginTop: "85px" }}>
            <div className="p-4 shadow-sm rounded bg-white w-100 mb-4">
                <h5 className="fw-semibold mb-3 fw-bold text-primary">Session Summary</h5>
                
                <Form.Select value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)} className="mb-3 w-auto">
                    <option value="all">All Time</option>
                    <option value="1m">This Month</option>
                    <option value="3m">Last 3 Months</option>
                    <option value="6m">Last 6 Months</option>
                    <option value="1y">Last 1 Year</option>
                </Form.Select>

                <Row className="mt-4">
                    <Col md={6} className="d-flex">
                        <Card className="p-3 shadow-sm bg-light w-100">
                            <h6 className="text-center fw-semibold text-dark">Attendance Overview</h6>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={attendanceData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label
                                    >
                                        {attendanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                    <Col md={6} className="d-flex">
                        <Card className="p-3 shadow-sm bg-light w-100">
                            <h6 className="text-center fw-semibold text-dark">Performance Overview</h6>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between bg-light">
                                    <span>Total Working Days</span>
                                    <strong>{totalWorkingDays}</strong>
                                </li>
                                <li className="list-group-item d-flex justify-content-between bg-light">
                                    <span>Present Days</span>
                                    <strong>{totalPresents}</strong>
                                </li>
                                <li className="list-group-item d-flex justify-content-between bg-light">
                                    <span>Leaves</span>
                                    <strong>{totalLeaves}</strong>
                                </li>
                                <li className="list-group-item d-flex justify-content-between bg-light">
                                    <span>Absents</span>
                                    <strong>{totalAbsents}</strong>
                                </li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Stats;
