import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode/esm/html5-qrcode-scanner";
import { getManagers, getUserById, updateLoginSessions } from "../../Services/Users";
import { Button } from "react-bootstrap";
import { X } from "lucide-react";

const QRCodeScanner = ({onClose}) => {
    const [status, setStatus] = useState("");

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

        scanner.render(handleScan, handleError);

        return () => {
            scanner.clear();
            stopCamera();
        };
    }, []);

    const stopCamera = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                stream.getTracks().forEach(track => track.stop());
            })
            .catch((err) => console.error("Error stopping camera:", err));
    };

    const isWithinRange = (empLat, empLng, managerLat, managerLng, radius) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const earthRadius = 6371000;
        const lat1 = toRad(managerLat);
        const lon1 = toRad(managerLng);
        const lat2 = toRad(empLat);
        const lon2 = toRad(empLng);
        const dLat = lat2 - lat1;
        const dLng = lon2 - lon1;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        return distance <= radius;
    };
    const handleScan = async (decodedText) => {
        try {
            const decodedData = JSON.parse(atob(decodedText));
            const { id, managerId, location } = decodedData;
            const [empLat, empLng] = location.split(",").map(Number);

            const managers = await getManagers();
            const manager = managers.find((mgr) => mgr.id === managerId);
            if (!manager) {
                setStatus("❌ Invalid QR Code: Manager Not Found");
                return;
            }

            const { latitude, longitude, radius } = manager.location;
            if (!isWithinRange(empLat, empLng, latitude, longitude, radius)) {
                setStatus("❌ Invalid QR Code: Employee is Outside Manager's Location");
                return;
            }
    
            if (!manager.staff.includes(id)) {
                setStatus("❌ Invalid QR Code: Employee is Not Under This Manager");
                return;
            }

            const employee = await getUserById(id, "employee");
            if (!employee) {
                setStatus("❌ Invalid QR Code: Employee Not Found");
                return;
            }
    
            let updatedSessions = [...employee.loginSessions];
            const lastSession = updatedSessions[updatedSessions.length - 1];
            const currentTime = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).replace(" ", "T") + "+05:30";
    
            if (lastSession) {
                const loginDate = new Date(lastSession.loginTime).toDateString();
                const logoutDate = lastSession.logoutTime ? new Date(lastSession.logoutTime).toDateString() : null;
                const currentDate = new Date().toDateString();
    
                if (loginDate === currentDate && logoutDate === currentDate) {
                    setStatus("❌ You have been logged out for today.");
                    return;
                }
            }
    
            if (lastSession && lastSession.logoutTime === null) {
                lastSession.logoutTime = currentTime;
            } else {
                updatedSessions.push({ loginTime: currentTime, logoutTime: null });
            }
    
            await updateLoginSessions(id, updatedSessions);
    
            setStatus("✅ Attendance Updated Successfully!");
        } catch (error) {
            console.error("QR Scan Error:", error);
            setStatus("❌ Invalid QR Code");
        }
    };

    const handleError = (err) => {
        console.error("QR Scanner Error:", err);
    };

    return (
        <div className="container text-center bg-secondary">
            <Button
                variant="light"
                className="position-absolute top-0 end-0 border-0 bg-transparent"
                onClick={onClose}
                aria-label="Close"
            >
                <X size={24} color="#dc3545" />
            </Button>
            <h3>QR Code Scanner</h3>
            <div id="reader" style={{ width: "100%" }}></div>
            <div className="mt-3">
                <h5>Status:</h5>
                <p>{status}</p>
            </div>
        </div>
    );
};

export default QRCodeScanner;