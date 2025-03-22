import { ArrowLeft } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const AttendanceLayout = () => {
    const id = useLocation().state?.id;
    const managerId = useLocation().state?.managerId;
    const backButtonStyle = {
        transition: "all 0.3s ease",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "4px",
        padding: "8px 16px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
    };

    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/manager/employees", { state: { managerId } });
    };

    if (!id || !managerId) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className="mb-4 mt-2">
                <button
                    className="btn btn-light shadow-sm"
                    onClick={handleBack}
                    style={backButtonStyle}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#e9ecef";
                        e.currentTarget.style.borderColor = "#ced4da";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                        e.currentTarget.style.borderColor = "#dee2e6";
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.backgroundColor = "#dde0e3";
                        e.currentTarget.style.transform = "scale(0.98)";
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.backgroundColor = "#e9ecef";
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                >
                    <ArrowLeft size={18} className="me-2" /> Back to Employees
                </button>
            </div>
        </>
    );
};

export default AttendanceLayout;