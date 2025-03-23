import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { getUserById } from "../../Services/Users";

const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#2196F3"];

const parseTimestamp = (timestamp) => (timestamp ? new Date(timestamp) : null);

const getWorkingDays = (startDate, endDate) => {
    let workingDays = [];
    let currentDate = new Date(startDate);
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    let endDateCopy = new Date(endDate);
    endDateCopy = new Date(endDateCopy.getFullYear(), endDateCopy.getMonth(), endDateCopy.getDate());

    while (currentDate <= endDateCopy) {
        if (currentDate.getDay() !== 0) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            workingDays.push(dateString);
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

const Stats = () => {
    const [loginSessions, setLoginSessions] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [attendanceRange, setAttendanceRange] = useState("1m");
    const [sessionRange, setSessionRange] = useState("1m");
    const location = useLocation();
    const employeeId = location.state?.id;
    
    useEffect(() => {
        const fetchEmployee = async () => {
            if (!employeeId) return;
            const employee = await getUserById(employeeId, "employee");
            setLoginSessions(employee.loginSessions);
            setLeaves(employee.leaves);
        }
        fetchEmployee();
    }, [employeeId, loginSessions]);

    if (!loginSessions || loginSessions.length === 0) {
        return (
            <div className="container">
                <div className="p-5 shadow-sm rounded bg-white w-100 mt-4 text-center">
                    <h4 className="text-muted">No attendance records found</h4>
                    <p className="text-secondary">Records will appear once the employee has logged attendance.</p>
                </div>
            </div>
        );
    }

    const firstLoginDate = parseTimestamp(loginSessions[0].loginTime);
    const now = new Date();

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

    const leaveDays = new Set(leaves || []);

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

    let otSessions = 0, earlyLogoutSessions = 0, normalLogoutSessions = 0;
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

    // Custom render for pie chart legend
    const renderColorfulLegendText = (value, entry) => {
        return <span style={{ color: entry.color, fontWeight: 500, padding: '0 8px' }}>{value}</span>;
    };

    return (
        <div className="container py-3">
            <div className="p-4 shadow rounded bg-white w-100 mb-4 border-top border-4 border-primary">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
                    <h5 className="fw-bold text-primary m-0 mb-2 mb-md-0">
                        <i className="bi bi-calendar-check me-2"></i>
                        Attendance Overview
                    </h5>
                    <Form.Select
                        value={attendanceRange}
                        onChange={(e) => setAttendanceRange(e.target.value)}
                        className="w-auto ms-md-auto shadow-sm"
                        style={{ maxWidth: '180px', fontSize: '0.9rem' }}
                    >
                        <option value="all">All Time</option>
                        <option value="1m">This Month</option>
                        <option value="3m">Last 3 Months</option>
                        <option value="6m">Last 6 Months</option>
                        <option value="1y">Last 1 Year</option>
                    </Form.Select>
                </div>

                <Row className="g-4">
                    <Col lg={6} className="d-flex">
                        <Card className="rounded shadow-sm border-0 w-100 overflow-hidden">
                            <div className="bg-light p-3 border-bottom">
                                <h6 className="text-center fw-bold text-dark m-0">
                                    <i className="bi bi-pie-chart me-2"></i>
                                    Attendance Distribution
                                </h6>
                            </div>
                            {attendanceData.length > 0 ? (
                                <div className="p-3">
                                    <div style={{ width: '100%', height: '250px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={attendanceData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={85}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    labelLine={false}
                                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                                        const RADIAN = Math.PI / 180;
                                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                        return (
                                                            <text
                                                                x={x}
                                                                y={y}
                                                                fill="white"
                                                                textAnchor={x > cx ? 'start' : 'end'}
                                                                dominantBaseline="central"
                                                                fontWeight="bold"
                                                            >
                                                                {`${(percent * 100).toFixed(0)}%`}
                                                            </text>
                                                        );
                                                    }}
                                                >
                                                    {attendanceData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    formatter={(value, name) => [
                                                        `${value} days (${((value / totalWorkingDays) * 100).toFixed(1)}%)`, 
                                                        name
                                                    ]}
                                                />
                                                <Legend formatter={renderColorfulLegendText} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-center align-items-center p-5">
                                    <p className="text-center text-muted m-0">No data available for selected period</p>
                                </div>
                            )}
                        </Card>
                    </Col>
                    <Col lg={6} className="d-flex">
                        <Card className="rounded shadow-sm border-0 w-100 overflow-hidden">
                            <div className="bg-light p-3 border-bottom">
                                <h6 className="text-center fw-bold text-dark m-0">
                                    <i className="bi bi-clipboard-data me-2"></i>
                                    Attendance Details
                                </h6>
                            </div>
                            <div className="p-0">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <span className="text-secondary fw-medium">
                                            <i className="bi bi-calendar-week me-2 text-primary"></i>
                                            Total Working Days
                                        </span>
                                        <span className="badge bg-primary rounded-pill fs-6">{totalWorkingDays}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <span className="text-secondary fw-medium">
                                            <i className="bi bi-check-circle-fill me-2 text-success"></i>
                                            Present Days
                                        </span>
                                        <span className="badge bg-success rounded-pill fs-6">{totalPresents}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <span className="text-secondary fw-medium">
                                            <i className="bi bi-calendar-minus me-2 text-warning"></i>
                                            Leaves
                                        </span>
                                        <span className="badge bg-warning text-dark rounded-pill fs-6">{totalLeaves}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <span className="text-secondary fw-medium">
                                            <i className="bi bi-x-circle-fill me-2 text-danger"></i>
                                            Absents
                                        </span>
                                        <span className="badge bg-danger rounded-pill fs-6">{totalAbsents}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <span className="text-secondary fw-medium">
                                            <i className="bi bi-percent me-2 text-primary"></i>
                                            Attendance Rate
                                        </span>
                                        <span className="badge bg-primary rounded-pill fs-6">
                                            {totalWorkingDays > 0 ? ((totalPresents / totalWorkingDays) * 100).toFixed(1) : 0}%
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="p-4 shadow rounded bg-white w-100 mb-4 border-top border-4 border-info">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
                    <h5 className="fw-bold text-info m-0 mb-2 mb-md-0">
                        <i className="bi bi-graph-up me-2"></i>
                        Session Analysis
                    </h5>
                    <Form.Select
                        value={sessionRange}
                        onChange={(e) => setSessionRange(e.target.value)}
                        className="w-auto ms-md-auto shadow-sm"
                        style={{ maxWidth: '180px', fontSize: '0.9rem' }}
                    >
                        <option value="all">All Time</option>
                        <option value="1m">This Month</option>
                        <option value="3m">Last 3 Months</option>
                        <option value="6m">Last 6 Months</option>
                        <option value="1y">Last 1 Year</option>
                    </Form.Select>
                </div>

                <Row className="g-4">
                    <Col lg={6} className="d-flex">
                        <Card className="rounded shadow-sm border-0 w-100 overflow-hidden">
                            <div className="bg-light p-3 border-bottom">
                                <h6 className="text-center fw-bold text-dark m-0">
                                    <i className="bi bi-clock-history me-2"></i>
                                    Session Breakdown
                                </h6>
                            </div>
                            {sessionData.length > 0 ? (
                                <div className="p-3">
                                    <div style={{ width: '100%', height: '250px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={sessionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={85}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                                        const RADIAN = Math.PI / 180;
                                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                        return (
                                                            <text
                                                                x={x}
                                                                y={y}
                                                                fill="white"
                                                                textAnchor={x > cx ? 'start' : 'end'}
                                                                dominantBaseline="central"
                                                                fontWeight="bold"
                                                            >
                                                                {`${(percent * 100).toFixed(0)}%`}
                                                            </text>
                                                        );
                                                    }}
                                                >
                                                    {sessionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    formatter={(value, name) => [
                                                        `${value} sessions`, 
                                                        name
                                                    ]}
                                                />
                                                <Legend formatter={renderColorfulLegendText} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-center align-items-center p-5">
                                    <p className="text-center text-muted m-0">No data available for selected period</p>
                                </div>
                            )}
                        </Card>
                    </Col>

                    <Col lg={6} className="d-flex">
                        <Card className="rounded shadow-sm border-0 w-100 overflow-hidden">
                            <div className="bg-light p-3 border-bottom">
                                <h6 className="text-center fw-bold text-dark m-0">
                                    <i className="bi bi-list-check me-2"></i>
                                    Session Details
                                </h6>
                            </div>
                            <div className="p-0">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <span className="text-secondary fw-medium">
                                            <i className="bi bi-calendar-check me-2 text-primary"></i>
                                            Total Sessions
                                        </span>
                                        <span className="badge bg-primary rounded-pill fs-6">
                                            {earlyLogoutSessions + normalLogoutSessions + otSessions}
                                        </span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <span className="text-secondary fw-medium">
                                            <i className="bi bi-stopwatch me-2 text-danger"></i>
                                            Early Logout
                                        </span>
                                        <span className="badge bg-danger rounded-pill fs-6">{earlyLogoutSessions}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <span className="text-secondary fw-medium">
                                            <i className="bi bi-check2-circle me-2 text-success"></i>
                                            Normal Logout
                                        </span>
                                        <span className="badge bg-success rounded-pill fs-6">{normalLogoutSessions}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <span className="text-secondary fw-medium">
                                            <i className="bi bi-alarm me-2 text-info"></i>
                                            Overtime (OT)
                                        </span>
                                        <span className="badge bg-info text-white rounded-pill fs-6">{otSessions}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <span className="text-secondary fw-medium">
                                            <i className="bi bi-bar-chart me-2 text-primary"></i>
                                            Efficiency Rate
                                        </span>
                                        <span className="badge bg-primary rounded-pill fs-6">
                                            {(earlyLogoutSessions + normalLogoutSessions + otSessions) > 0 
                                                ? ((normalLogoutSessions + otSessions) / (earlyLogoutSessions + normalLogoutSessions + otSessions) * 100).toFixed(1) 
                                                : 0}%
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Stats;