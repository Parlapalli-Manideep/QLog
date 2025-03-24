import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Card, Container, Row, Col, Badge, Button, Alert } from "react-bootstrap";
import { MapPin, Activity, LogIn, LogOut, Clock, CloudFog } from "lucide-react";
import { formatTime } from "../../Utils/AttendanceCalculations";
import { useLocation } from "react-router-dom";
import { getUserById } from "../../Services/Users";

const QRCodeComponent = () => {
    const [employee, setEmployee] = useState(null);
    const [loginSessions, setLoginSessions] = useState([]);
    const state = useLocation().state;
    const [location, setLocation] = useState(null);
    const [encodedData, setEncodedData] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [locationError, setLocationError] = useState(false);
    const [lastLogin, setLastLogin] = useState(null);
    useEffect(() => {
        const fetchEmployee = async () => {
            if (!state.id) return;
            const employeedata = await getUserById(state.id, "employee");
            setEmployee(employeedata)
            setLoginSessions(employeedata.loginSessions)
        }
        fetchEmployee();
    }, [state.id]);

    const getLocation = () => {
        setIsLoading(true);
        setLocationError(false);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const loc = {
                    latitude: position.coords.latitude.toFixed(6),
                    longitude: position.coords.longitude.toFixed(6),
                };
                console.log("loc",loc);
                
                const qrData = {
                    id: employee?.id,
                    name: employee?.name,
                    email: employee?.email,
                    managerId: employee?.managerId,
                    location: `${loc?.latitude},${loc?.longitude}`,
                    timestamp: new Date().toISOString(),
                };

                const encodedString = btoa(JSON.stringify(qrData));

                setEncodedData(encodedString);
                setLocation(loc);
                setIsLoading(false);
            },
            (error) => {
                console.error("Error fetching location:", error);
                setLocationError(true);
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    useEffect(() => {
        if (loginSessions && loginSessions.length > 0) {
            const sortedSessions = [...loginSessions].sort((a, b) =>
                new Date(b.loginTime) - new Date(a.loginTime)
            );
            setLastLogin(sortedSessions[0]);
        }

        getLocation();
    }, [employee, loginSessions]);

    const isActive = lastLogin && lastLogin.loginTime && !lastLogin.logoutTime;

    const getActiveTime = () => {
        if (!isActive || !lastLogin?.loginTime) return null;

        const loginDate = new Date(lastLogin.loginTime);
        const now = new Date();
        const diffMs = now - loginDate;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;

        return `${hours}:${minutes.toString().padStart(2, '0')} hrs`;
    };

    return (
        <Container className="mt-4 mb-4">
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6}>
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">{employee?.name}'s QR Code</h5>
                                {isActive && !isLoading && !locationError && (
                                    <Badge bg="success" className="d-flex align-items-center">
                                        <Activity size={16} className="me-1" /> Active
                                    </Badge>
                                )}
                            </div>
                        </Card.Header>

                        <Card.Body className="text-center py-4">
                            {locationError ? (
                                <div>
                                    <Alert variant="warning" className="d-flex align-items-center mb-3">
                                        <MapPin size={20} className="me-2" />
                                        Location access is required to generate your QR code
                                    </Alert>
                                    <Button
                                        variant="primary"
                                        onClick={getLocation}
                                        className="d-flex align-items-center mx-auto"
                                    >
                                        <MapPin size={16} className="me-2" />
                                        Enable Location
                                    </Button>
                                </div>
                            ) : isLoading ? (
                                <div className="d-flex flex-column align-items-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3">Generating QR code...</p>
                                </div>
                            ) : (
                                <div className="qr-container py-2">
                                    <QRCodeCanvas
                                        value={encodedData}
                                        size={window.innerWidth < 576 ? 180 : 220}
                                        level="H"
                                        includeMargin={true}
                                        bgColor="#ffffff"
                                        fgColor="#000000"
                                    />
                                </div>
                            )}
                        </Card.Body>

                        {lastLogin && !locationError && (
                            <Card.Footer className="bg-light p-2 p-sm-3">
                                <Row className="text-center g-2">
                                    <Col xs={6} className="border-end">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <LogIn size={16} className="me-1 text-success" />
                                            <small className="text-muted">Login:</small>
                                        </div>
                                        <div className="mt-1">
                                            {lastLogin.loginTime ? formatTime(lastLogin.loginTime) : "N/A"}
                                        </div>
                                    </Col>

                                    <Col xs={6}>
                                        {isActive ? (
                                            <>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Clock size={16} className="me-1 text-warning" />
                                                    <small className="text-muted">Working:</small>
                                                </div>
                                                <div className="mt-1">
                                                    {getActiveTime()}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <LogOut size={16} className="me-1 text-danger" />
                                                    <small className="text-muted">Logout:</small>
                                                </div>
                                                <div className="mt-1">
                                                    {lastLogin.logoutTime ? formatTime(lastLogin.logoutTime) : "N/A"}
                                                </div>
                                            </>
                                        )}
                                    </Col>
                                </Row>
                            </Card.Footer>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default QRCodeComponent;