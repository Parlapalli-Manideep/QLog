import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeComponent = ({ employee }) => {
    const [location, setLocation] = useState(null);
    const [encodedData, setEncodedData] = useState("");

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const loc = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                const qrData = {
                    id: employee.id,
                    name: employee.name,
                    email: employee.email,
                    managerId: employee.managerId,
                    location: `${loc.latitude},${loc.longitude}`,
                };

                const encodedString = btoa(JSON.stringify(qrData));

                setEncodedData(encodedString);
                setLocation(loc);
            },
            (error) => console.error("Error fetching location:", error),
            { enableHighAccuracy: true }
        );
    }, [employee]);

    return (
        <div className="text-center" style={{ marginTop: "85px" }}>
            <h5>Scan QR Code</h5>
            {encodedData ? <QRCodeCanvas value={encodedData} size={200} /> : <p>Generating QR...</p>}
        </div>
    );
};

export default QRCodeComponent;
