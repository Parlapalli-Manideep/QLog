import React from "react";
import { Card } from "react-bootstrap";

const Home = ({ userData }) => {
    return (
        <div className="container mt-4">
            <h4 className="mb-3">Home</h4>
            <Card className="p-3 shadow-sm">
                <h5>Today's Activity</h5>
                <div className="d-flex justify-content-between mt-3">
                    <div className="border p-3 rounded text-center">
                        <h6>Last Login</h6>
                        <p>{userData?.lastLogin || "Not logged in yet"}</p>
                    </div>
                    <div className="border p-3 rounded text-center">
                        <h6>Last Logout</h6>
                        <p>{userData?.lastLogout || "Active"}</p>
                    </div>
                    <div className="border p-3 rounded text-center">
                        <h6>Status</h6>
                        <p className={`fw-bold ${userData?.lastLogout ? "text-success" : "text-danger"}`}>
                            {userData?.lastLogout ? "Inactive" : "Active"}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Home;
