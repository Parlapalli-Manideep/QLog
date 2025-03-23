import React, { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from "recharts";
import { Container, Row, Col, Card, Spinner, Form, Nav, Tab } from "react-bootstrap";
import { calculateAttendanceMetrics } from "../../Utils/AnalyticsCalculations";
import { useLocation } from "react-router-dom";
import { getUserById } from "../../Services/Users";

const Analytics = () => {
    const id = useLocation().state?.id;
    const [manager, setManager] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attendanceRange, setAttendanceRange] = useState("all");
    const [metrics, setMetrics] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    useEffect(() => {
        const fetchData = async () => {
            const data = await getUserById(id, "manager");
            setManager(data);
        };
        fetchData();
    }, [id]);
    useEffect(() => {
        if (manager?.staff) {
            fetchData();
        }
    }, [manager, attendanceRange]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const calculatedMetrics = await calculateAttendanceMetrics(manager, attendanceRange);
            setMetrics(calculatedMetrics);
        } catch (error) {
            console.error("Error calculating metrics:", error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ["#28a745", "#ffc107", "#dc3545"];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" role="status" />
                <p className="mt-2">Loading analytics data...</p>
            </div>
        );
    }

    if (!metrics) {
        return <div className="alert alert-warning">No data available for analysis</div>;
    }

    return (
        <Container>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h4 className="text-primary font-weight-bold">Employee Analytics Dashboard</h4>
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

            <Tab.Container id="analytics-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav variant="tabs" className="mb-4 flex-nowrap overflow-auto small-tabs">
                    <Nav.Item>
                        <Nav.Link eventKey="overview">Overview</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="today">Today's Attendance</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="trends">Attendance Trends</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="performance">Employee Performance</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="overview">
                        <Row className="gy-4">
                            <Col lg={6} md={12}>
                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <h5 className="text-center mb-4">Attendance Overview</h5>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={metrics.pieChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel}
                                                >
                                                    {metrics.pieChartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [`${value} days`, null]} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <h5 className="text-center mb-4">Login Hour Distribution</h5>
                                        <ResponsiveContainer width="100%" height="100%" minHeight={250}>                                            <BarChart data={metrics.hourDistribution}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} />
                                            <YAxis label={{ value: 'Login Count', angle: -90, position: 'insideLeft' }} />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#8884d8" />
                                        </BarChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <h5 className="text-center mb-4">Weekly Attendance Pattern</h5>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={metrics.weekdayDistribution}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="day" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="present" stackId="a" fill="#28a745" />
                                                <Bar dataKey="leave" stackId="a" fill="#ffc107" />
                                                <Bar dataKey="absent" stackId="a" fill="#dc3545" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <h5 className="text-center mb-4">Monthly Attendance Trend</h5>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={metrics.monthlyAttendance}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="present" stroke="#28a745" />
                                                <Line type="monotone" dataKey="leave" stroke="#ffc107" />
                                                <Line type="monotone" dataKey="absent" stroke="#dc3545" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab.Pane>

                    <Tab.Pane eventKey="today">
                        <Row>
                            <Col md={6}>
                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <h5 className="text-center mb-4">Today's Attendance</h5>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: "Active", value: metrics.todayAttendance.active },
                                                        { name: "On Leave", value: metrics.todayAttendance.onLeave },
                                                        { name: "Absent", value: metrics.todayAttendance.absent }
                                                    ]}
                                                    dataKey="value"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel}
                                                >
                                                    {[0, 1, 2].map((index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [`${value} employees`, null]} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <h5 className="text-center mb-4">Attendance Details</h5>
                                        <ul className="list-group">
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>Total Employees</span>
                                                <span className="badge bg-primary rounded-pill">{manager.staff.length}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>Active (Logged In)</span>
                                                <span className="badge bg-success rounded-pill">{metrics.todayAttendance.active}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>On Leave</span>
                                                <span className="badge bg-warning rounded-pill">{metrics.todayAttendance.onLeave}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>Absent (Not Logged In)</span>
                                                <span className="badge bg-danger rounded-pill">{metrics.todayAttendance.absent}</span>
                                            </li>
                                        </ul>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab.Pane>

                    <Tab.Pane eventKey="trends">
                        <Row>
                            <Col md={12}>
                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <h5 className="text-center mb-4">Monthly Attendance Trend</h5>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <LineChart data={metrics.monthlyAttendance}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="present" stroke="#28a745" strokeWidth={2} />
                                                <Line type="monotone" dataKey="leave" stroke="#ffc107" strokeWidth={2} />
                                                <Line type="monotone" dataKey="absent" stroke="#dc3545" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <h5 className="text-center mb-4">Weekly Attendance Pattern</h5>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={metrics.weekdayDistribution}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="day" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="present" stackId="a" fill="#28a745" />
                                                <Bar dataKey="leave" stackId="a" fill="#ffc107" />
                                                <Bar dataKey="absent" stackId="a" fill="#dc3545" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <h5 className="text-center mb-4">Login Hour Distribution</h5>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={metrics.hourDistribution}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} />
                                                <YAxis label={{ value: 'Login Count', angle: -90, position: 'insideLeft' }} />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab.Pane>

                    <Tab.Pane eventKey="performance">
                        <Row>
                            <Col md={12}>
                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <h5 className="text-center mb-4">Employee Attendance Performance</h5>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={metrics.employeePerformance}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis label={{ value: 'Attendance %', angle: -90, position: 'insideLeft' }} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="attendance" fill="#4285F4" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <h5 className="text-center mb-4">Employee Leave & Absent Details</h5>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={metrics.employeePerformance}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="leaves" fill="#ffc107" />
                                                <Bar dataKey="absents" fill="#dc3545" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );
};

export default Analytics;