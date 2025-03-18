import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Container, Row, Col, Card, Spinner, Form } from "react-bootstrap";
import { getUserById } from "../../Services/Users";

const Analytics = ({ manager }) => {
    const [loading, setLoading] = useState(true);
    const [attendanceData, setAttendanceData] = useState({ active: 0, onLeave: 0, absent: 0 });
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [attendanceRange, setAttendanceRange] = useState("all");
    const [totalWorkingDays, setTotalWorkingDays] = useState(0);
    const [totalPresents, setTotalPresents] = useState(0);
    const [totalLeaves, setTotalLeaves] = useState(0);
    const [totalAbsents, setTotalAbsents] = useState(0);
    const [pieChartData, setPieChartData] = useState([]);

    useEffect(() => {
        if (manager?.staff) {
            setTotalEmployees(manager.staff.length);
            fetchEmployeeData();
        }
    }, [manager, attendanceRange]);

    const getDateRangeStart = () => {
        const today = new Date();
        
        switch (attendanceRange) {
            case "1m":
                return new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            case "3m":
                return new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
            case "6m":
                return new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
            case "1y":
                return new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
            default:
                return null; 
        }
    };

    const fetchEmployeeData = async () => {
        if (!manager?.staff) return;

        let activeCount = 0;
        let leaveCount = 0;
        const todayDate = new Date().toLocaleDateString("en-CA");
        let presentDays = 0;
        let leaveDays = 0;
        let absentDays = 0;
        let totalDays = 0;

        for (const employeeId of manager.staff) {
            try {
                const employee = await getUserById(employeeId, "employee");

                if (!employee || !employee.LoginSessions || employee.LoginSessions.length === 0) {
                    continue; 
                }

                const lastSession = employee.LoginSessions[employee.LoginSessions.length - 1];
                if (lastSession.loginTime && !lastSession.logoutTime) {
                    activeCount++;
                }

                const currentYear = new Date().getFullYear().toString();
                if (employee?.Leaves?.[currentYear]?.includes(todayDate)) {
                    leaveCount++;
                }

                const firstLoginDate = new Date(employee.LoginSessions[0].loginTime);
                const today = new Date();
                
                let startDate = getDateRangeStart() || firstLoginDate;
                if (startDate < firstLoginDate) startDate = firstLoginDate;
                
                let currentDate = new Date(startDate);
                while (currentDate <= today) {
                    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                        const dateString = currentDate.toLocaleDateString("en-CA");
                        totalDays++;
                        
                        const wasPresent = employee.LoginSessions.some(session => {
                            const sessionDate = new Date(session.loginTime).toLocaleDateString("en-CA");
                            return sessionDate === dateString;
                        });
                        
                        const year = currentDate.getFullYear().toString();
                        const wasOnLeave = employee?.Leaves?.[year]?.includes(dateString);
                        
                        if (wasPresent) {
                            presentDays++;
                        } else if (wasOnLeave) {
                            leaveDays++;
                        } else {
                            absentDays++;
                        }
                    }
                    
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            } catch (error) {
                console.error(`Error fetching employee ${employeeId}:`, error);
            }
        }

        const absentCount = manager.staff.length - activeCount - leaveCount;

        setAttendanceData({
            active: activeCount,
            onLeave: leaveCount,
            absent: absentCount
        });

        setTotalWorkingDays(totalDays);
        setTotalPresents(presentDays);
        setTotalLeaves(leaveDays);
        setTotalAbsents(absentDays);

        setPieChartData([
            { name: "Present", value: presentDays },
            { name: "Leave", value: leaveDays },
            { name: "Absent", value: absentDays }
        ]);

        setLoading(false);
    };

    const COLORS = ["#28a745", "#ffc107", "#dc3545"];
    const pieData = [
        { name: "Active", value: attendanceData.active },
        { name: "On Leave", value: attendanceData.onLeave },
        { name: "Absent", value: attendanceData.absent }
    ];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Container style={{ margin: "85px auto auto 20px" }}>
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
                
                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" role="status" />
                        <p className="mt-2">Loading attendance data...</p>
                    </div>
                ) : (
                    <Row className="mt-4">
                        <Col md={6} className="d-flex">
                            <Card className="p-3 shadow-sm bg-light w-100">
                                <h6 className="text-center fw-semibold text-dark">Attendance Overview</h6>
                                {pieChartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} days`, null]} />
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
                )}
            </div>

            <div className="attendance-overview mt-4">
                <h4 className="text-primary font-weight-bold mb-4">Today's Attendance</h4>

                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" role="status" />
                        <p className="mt-2">Loading attendance data...</p>
                    </div>
                ) : (
                    <Row className="gx-4">
                        <Col md={6}>
                            <Card className="p-3 shadow-sm h-100">
                                <h5 className="text-center mb-4">Today's Attendance</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value} employees`, null]} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="p-3 shadow-sm h-100">
                                <h5 className="text-center mb-4">Attendance Details</h5>
                                <ul className="list-group">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>Total Employees</span>
                                        <span className="badge bg-primary rounded-pill">{totalEmployees}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>Active (Logged In)</span>
                                        <span className="badge bg-success rounded-pill">{attendanceData.active}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>On Leave</span>
                                        <span className="badge bg-warning rounded-pill">{attendanceData.onLeave}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>Absent (Not Logged In)</span>
                                        <span className="badge bg-danger rounded-pill">{attendanceData.absent}</span>
                                    </li>
                                </ul>
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>
        </Container>
    );
};

export default Analytics;