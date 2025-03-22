import { useState, useEffect, use } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getUserById, updateUser } from "../../Services/Users";
import { useLocation } from "react-router-dom";
import defaultProfilePic from "../../Assets/defaultProfilePic.jpg"; 

const ManagerProfile = () => {
    const id = useLocation().state?.id;
    const [manager, setManager] = useState({});
    const defaultProfile = {
        profilePic: defaultProfilePic,    
        phone: "",
        bio: "",
    };
    const storedProfile = localStorage.getItem(`manager_${manager.id}`);
    const parsedProfile = storedProfile ? JSON.parse(storedProfile) : {};
    const [profile, setProfile] = useState({ ...defaultProfile, ...manager, ...parsedProfile });
    const [editing, setEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            const data = await getUserById(id, "manager");
            setManager(data);
        };
        fetchData();
        
    }, [id,storedProfile]);
    useEffect(() => {
        const storedProfile1 = localStorage.getItem(`manager_${manager.id}`);
            const parsedProfile1 = storedProfile ? JSON.parse(storedProfile1) : {};
            setProfile({ ...defaultProfile,...parsedProfile1,...manager, });
    }, [manager]);
         

    const handleChange = (e) => {
        setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
    };

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
            `manager_${manager.id}`,
            JSON.stringify({ profilePic: updatedProfile.profilePic })
        );

        await updateUser(manager.email, "manager", {
            phone: updatedProfile.phone,
            bio: updatedProfile.bio,
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
                <h4 className="fw-bold">{profile.name?.toUpperCase() || "Manager Name"}</h4>
                <p className="text-muted">{profile.role || "Role Not Assigned"}</p>
            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="p-3 shadow-sm rounded bg-light h-100">
                        <h5 className="fw-bold">Personal Information</h5>
                        <p>📍 Location:</p>
                        <ul>
                            <li><strong>Latitude:</strong> {profile?.location?.latitude}</li>
                            <li><strong>Longitude:</strong> {profile?.location?.longitude}</li>
                            <li><strong>Radius:</strong> {profile?.location?.radius}m</li>
                        </ul>
                        <p>📞 {profile?.phone || "Not Updated"}</p>
                        <p>📝 {profile?.bio || "Not Updated"}</p>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="p-3 shadow-sm rounded bg-light h-100">
                        <h5 className="fw-bold">Work Information</h5>
                        <p><strong>Manager ID:</strong> {profile?.id || "N/A"}</p>
                        <p><strong>Email:</strong> {profile?.email || "N/A"}</p>
                        <p><strong>Authentication Method:</strong> {profile?.method || "N/A"}</p>
                        <p><strong>Staff Count:</strong> {profile?.staff?.length}</p>
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
                            <label className="form-label fw-bold">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={tempProfile.phone || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Bio</label>
                            <textarea
                                name="bio"
                                value={tempProfile.bio || ""}
                                onChange={handleChange}
                                className="form-control"
                                rows="3"
                            ></textarea>
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

export default ManagerProfile;
