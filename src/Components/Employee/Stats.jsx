import React, { useState } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#2196F3"];

const parseTimestamp = (timestamp) => (timestamp ? new Date(timestamp) : null);

const getWorkingDays = (startDate, endDate) => {
    let workingDays = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        if (currentDate.getDay() !== 0) { 
            workingDays.push(currentDate.toISOString().split("T")[0]);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return workingDays;
};

const calculateDuration = (loginTime, logoutTime) => {
    const diffMs = logoutTime - loginTime;
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    return { totalMinutes };
};

const getSessionStatus = (totalMinutes) => {
    if (totalMinutes < 480) return { status: "Early Logout" };
    if (totalMinutes >= 480 && totalMinutes <= 510) return { status: "Normal Logout" };
    if (totalMinutes > 510) return { status: "OT" };
};

const filterByDateRange = (sessions, startDate, endDate) => {
    return sessions.filter((session) => {
        const loginTime = parseTimestamp(session.loginTime);
        return loginTime >= startDate && loginTime <= endDate;
    });
};

const Stats = ({ loginSessions, leaves }) => {
    if (!loginSessions || loginSessions.length === 0) {
        return <p className="text-center mt-4">No attendance records found.</p>;
    }

    const firstLoginDate = parseTimestamp(loginSessions[0].loginTime);
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const lastSession = loginSessions[loginSessions.length - 1];
    const lastLogin = parseTimestamp(lastSession?.loginTime);
    const lastLogout = parseTimestamp(lastSession?.logoutTime);
    const isToday = lastLogin && now.toDateString() === lastLogin.toDateString();
    const isActive = isToday && !lastLogout;

    const [attendanceRange, setAttendanceRange] = useState("1m");
    const [sessionRange, setSessionRange] = useState("1m");
    
    let attendanceStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
    if (attendanceRange === "3m") attendanceStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    else if (attendanceRange === "6m") attendanceStartDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    else if (attendanceRange === "1y") attendanceStartDate = new Date(now.getFullYear() - 1, 0, 1);
    else if (attendanceRange === "all") attendanceStartDate = firstLoginDate;
    
    if (attendanceStartDate < firstLoginDate) {
        attendanceStartDate = firstLoginDate;
    }

    let sessionStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
    if (sessionRange === "3m") sessionStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    else if (sessionRange === "6m") sessionStartDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    else if (sessionRange === "1y") sessionStartDate = new Date(now.getFullYear() - 1, 0, 1);
    else if (sessionRange === "all") sessionStartDate = firstLoginDate;
    
    if (sessionStartDate < firstLoginDate) {
        sessionStartDate = firstLoginDate;
    }

    const workingDays = getWorkingDays(attendanceStartDate, now);
    const presentDays = new Set(
        loginSessions.map(session => session.loginTime.split("T")[0])
    );
    
    const leaveDays = new Set(leaves?.[now.getFullYear()] || []);
    
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
    ].filter((item) => item.value > 0);


    const filteredSessions = filterByDateRange(loginSessions, sessionStartDate, now);

    let normalSessions = 0, otSessions = 0, earlyLogoutSessions = 0, normalLogoutSessions = 0;
    filteredSessions.forEach((session) => {
        const loginTime = parseTimestamp(session.loginTime);
        const logoutTime = parseTimestamp(session.logoutTime);
        if (!loginTime || !logoutTime) return;
        const { totalMinutes } = calculateDuration(loginTime, logoutTime);
        const { status } = getSessionStatus(totalMinutes);

        if (status === "Early Logout") earlyLogoutSessions++;
        else if (status === "Normal Logout") normalLogoutSessions++;
        else if (status === "OT") otSessions++;
    });

    const sessionData = [
        { name: "Early Logout", value: earlyLogoutSessions },
        { name: "Normal Logout", value: normalLogoutSessions },
        { name: "OT", value: otSessions }
    ].filter((item) => item.value > 0);

    return (
        <div className="container" style={{ margin: "85px auto auto 75px" }}>
            <div className="p-4 shadow-sm rounded bg-white w-100 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-semibold fw-bold text-primary m-0">Attendance Overview</h5>
                    <Form.Select 
                        value={attendanceRange} 
                        onChange={(e) => setAttendanceRange(e.target.value)} 
                        className="w-auto"
                    >
                        <option value="all">All Time</option>
                        <option value="1m">This Month</option>
                        <option value="3m">Last 3 Months</option>
                        <option value="6m">Last 6 Months</option>
                        <option value="1y">Last 1 Year</option>
                    </Form.Select>
                </div>
                
                <Row className="mt-4">
                    <Col md={6} className="d-flex">
                        <Card className="p-3 shadow-sm bg-light w-100">
                            <h6 className="text-center fw-semibold text-dark">Attendance Overview</h6>
                            {attendanceData.length > 0 ? (
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
                            ) : (
                                <p className="text-center text-muted mt-3">No data available</p>
                            )}
                        </Card>
                    </Col>
                    <Col md={6} className="d-flex">
                        <Card className="p-3 shadow-sm bg-light w-100">
                            <h6 className="text-center fw-semibold text-dark">Attendance Details</h6>
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

            <div className="p-4 shadow-sm rounded bg-white w-100 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-semibold fw-bold text-primary m-0">Session Analysis</h5>
                    <Form.Select 
                        value={sessionRange} 
                        onChange={(e) => setSessionRange(e.target.value)} 
                        className="w-auto"
                    >
                        <option value="all">All Time</option>
                        <option value="1m">This Month</option>
                        <option value="3m">Last 3 Months</option>
                        <option value="6m">Last 6 Months</option>
                        <option value="1y">Last 1 Year</option>
                    </Form.Select>
                </div>
                
                <Row className="mt-4">
                    <Col md={6} className="d-flex">
                        <Card className="p-3 shadow-sm bg-light w-100">
                            <h6 className="text-center fw-semibold text-dark">Session Breakdown</h6>
                            {sessionData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={sessionData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {sessionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                        <Card className="p-3 shadow-sm bg-light w-100">
                            <h6 className="text-center fw-semibold text-dark">Session Details</h6>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between bg-light">
                                    <span>Total Sessions</span>
                                    <strong>{earlyLogoutSessions + normalLogoutSessions + otSessions}</strong>
                                </li>
                                <li className="list-group-item d-flex justify-content-between bg-light">
                                    <span>Early Logout Sessions</span>
                                    <strong>{earlyLogoutSessions}</strong>
                                </li>
                                <li className="list-group-item d-flex justify-content-between bg-light">
                                    <span>Normal Logout Sessions</span>
                                    <strong>{normalLogoutSessions}</strong>
                                </li>
                                <li className="list-group-item d-flex justify-content-between bg-light">
                                    <span>Overtime (OT) Sessions</span>
                                    <strong>{otSessions}</strong>
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