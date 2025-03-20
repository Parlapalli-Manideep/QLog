import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { updateUser } from "../../Services/Users";

const ProfilePage = ({ employee }) => {
    const defaultProfile = {
        profilePic: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
        location: "",
        jobTitle: "",
        phone: "",
    };

    const storedProfile = localStorage.getItem(`employee_${employee.id}`);
    const parsedProfile = storedProfile ? JSON.parse(storedProfile) : {};
    const [profile, setProfile] = useState({ ...defaultProfile, ...employee, ...parsedProfile });
    const [editing, setEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState({});

    useEffect(() => {
        if (employee.id) {
            localStorage.setItem(
                `employee_${employee.id}`,
                JSON.stringify({
                    profilePic: profile.profilePic, 
                })
            );
        }
    }, [profile,employee]);

    const handleChange = (e) => {
        setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
    };
    const loginDate = employee?.loginSessions?.[0]?.loginTime
    ? new Date(employee.loginSessions[0].loginTime).toLocaleDateString("en-GB", {
        timeZone: "Asia/Kolkata"
    })
    : "N/A";
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempProfile({ ...tempProfile, profilePic: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedProfile = { ...profile, ...tempProfile };

        localStorage.setItem(
            `employee_${employee.id}`,
            JSON.stringify({ profilePic: updatedProfile.profilePic })
        );

        await updateUser(employee.email, "employee", {
            location: updatedProfile.location,
            jobTitle: updatedProfile.jobTitle,
            phone: updatedProfile.phone,
        });

        setProfile(updatedProfile);
        setEditing(false);
    };

    const handleCancel = () => {
        setEditing(false);
        setTempProfile({});
    };

    return (
        <div className="container position-relative" style={{ marginLeft: "20px" }}>
            {editing && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 backdrop-blur" style={{ zIndex: 10 }}></div>
            )}

            <div className="position-relative bg-primary text-white rounded-top text-center" style={{ height: "140px" }}></div>

            <div className="text-center" style={{ marginTop: "-70px" }}>
                <div className="d-inline-block position-relative border border-4 border-white rounded-circle overflow-hidden" style={{ width: "140px", height: "140px" }}>
                    <img src={profile.profilePic} alt="Profile" className="w-100 h-100 object-fit-cover" />
                </div>
            </div>

            <div className="text-center mt-3">
                <h4 className="fw-bold">{profile.name?.toUpperCase() || "Employee Name"}</h4>
                <p className="text-muted">{employee.role || "Role Not Assigned"}</p>
            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="p-3 shadow-sm rounded bg-light">
                        <h5 className="fw-bold">Personal Information</h5>
                        <p>📍 {profile.location || "Not Updated"}</p>
                        <p>📞 {profile.phone || "Not Updated"}</p>
                        <p>📅 Joined <strong>{loginDate || "N/A"}</strong></p>
                        <p>💼 {profile.jobTitle || "Not Updated"}</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="p-3 shadow-sm rounded bg-light">
                        <h5 className="fw-bold">Work Information</h5>
                        <p><strong>Employee ID:</strong> {profile.id || "N/A"}</p>
                        <p><strong>Email:</strong> {profile.email || "N/A"}</p>
                        <p><strong>Manager ID:</strong> {profile.managerId || "N/A"}</p>
                        <p><strong>Authentication Method:</strong> {profile.method || "N/A"}</p>
                    </div>
                </div>
            </div>

            <div className="text-center mt-3">
                <button onClick={() => setEditing(true)} className="btn btn-dark btn-sm">
                    Edit Profile
                </button>
            </div>

            {editing && (
                <div className="position-fixed top-50 start-50 translate-middle bg-white p-4 rounded shadow" style={{ zIndex: 20, width: "350px" }}>
                    <form onSubmit={handleSubmit}>
                        <h5 className="text-center fw-bold mb-3">Edit Profile</h5>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Profile Picture</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
                            <input
                                type="text"
                                name="profilePic"
                                value={tempProfile.profilePic || ""}
                                onChange={handleChange}
                                placeholder="Paste Image URL"
                                className="form-control mt-2"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={tempProfile.location || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Job Title</label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={tempProfile.jobTitle || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={tempProfile.phone || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                            <button type="button" onClick={handleCancel} className="btn btn-danger w-45">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary w-45">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
