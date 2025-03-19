import { useState, useEffect } from "react";
import { updateUser, getUserById, getUserData } from "../../Services/Users";
import { MapPin, Map, Users, UserCheck, CalendarX } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const Home = ({ manager }) => {
  const [location, setLocation] = useState(manager?.location || { latitude: 17.3850, longitude: 78.4867, radius: "" });
  const [showModal, setShowModal] = useState(false);
  const [tempLocation, setTempLocation] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [employeesOnLeave, setEmployeesOnLeave] = useState(0);
  console.log(manager.location);
  
  useEffect(() => {
    if (manager?.staff && Array.isArray(manager.staff)) {
      fetchEmployeeData();
    }
  }, [manager]);


  const fetchEmployeeData = async () => {
    let activeCount = 0;
    let leaveCount = 0;
    const todayDate = new Date().toLocaleDateString("en-CA"); 

    for (const employeeId of manager.staff) {
      const employee = await getUserById(employeeId, "employee");
      
      if (employee?.loginSessions?.length > 0) {
        const lastSession = employee.loginSessions[employee.loginSessions.length - 1];

        if (lastSession.loginTime && !lastSession.logoutTime) {
          activeCount++;
        }
      }      
      if (employee?.leaves?.includes(todayDate)) {
        leaveCount++;
      }
    }

    setActiveEmployees(activeCount);
    setEmployeesOnLeave(leaveCount);
  };

  const updateLocation = async () => {
    if (!location.latitude || !location.longitude || !location.radius) {
      showTemporaryMessage("Please enter valid location details.", "danger");
      return;
    }

    try {
      const updatedFields = {
        location: {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          radius: parseInt(location.radius)
        }
      };

      const updatedUser = await updateUser(manager.email, "manager", updatedFields);

      if (updatedUser) {
        const refreshedManagerData = await getUserData(manager.email, "manager");
        
        if (refreshedManagerData?.location) {
          setLocation(refreshedManagerData.location);
        }
        
        showTemporaryMessage("Location updated successfully!", "success");
      } else {
        showTemporaryMessage("Failed to update location. User not found.", "danger");
      }
    } catch (error) {
      showTemporaryMessage("Error updating location. Please try again.", "danger");
      console.error("Error updating location:", error);
    }
  };

  const showTemporaryMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 1500);
  };

  const openMapModal = () => {
    setTempLocation({ latitude: location.latitude, longitude: location.longitude });
    setShowModal(true);
  };

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        setTempLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
      }
    });
    return tempLocation ? <Marker position={[tempLocation.latitude, tempLocation.longitude]} /> : null;
  };

  const confirmLocation = () => {
    if (tempLocation) {
      setLocation({ ...location, latitude: tempLocation.latitude, longitude: tempLocation.longitude });
      setShowModal(false);
    }
  };

  return (
    <div className="container" style={{ marginLeft: "20px" }}>
      {message.text && (
        <Alert variant={message.type} dismissible>
          {message.text}
        </Alert>
      )}

      <div className="card p-3 mb-3">
        <h5><MapPin size={20} /> Set Office Location</h5>

        <button className="btn btn-secondary mb-3" onClick={openMapModal}>
          <Map size={16} className="me-2" /> Select Location on Map
        </button>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Latitude</Form.Label>
            <Form.Control
              type="text"
              value={location.latitude}
              onChange={(e) => setLocation({ ...location, latitude: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Longitude</Form.Label>
            <Form.Control
              type="text"
              value={location.longitude}
              onChange={(e) => setLocation({ ...location, longitude: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Radius (meters)</Form.Label>
            <Form.Control
              type="number"
              value={location.radius}
              onChange={(e) => setLocation({ ...location, radius: e.target.value })}
            />
          </Form.Group>
          <Button variant="primary" onClick={updateLocation}>Update Location</Button>
        </Form>
      </div>
      <div className="card p-3 mb-3">
        <h5>Quick Information</h5>
        <div className="row">
          <div className="col-md-4">
            <div className="card text-white bg-info p-3">
              <h5><Users size={20} /> Total Employees</h5>
              <h3>{manager?.staff?.length || 0}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-success p-3">
              <h5><UserCheck size={20} /> Active Employees</h5>
              <h3>{activeEmployees}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-warning p-3">
              <h5><CalendarX size={20} /> Employees on Leave</h5>
              <h3>{employeesOnLeave}</h3>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header>
          <Modal.Title>Select Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MapContainer center={[tempLocation?.latitude || location.latitude, tempLocation?.longitude || location.longitude]} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationSelector />
          </MapContainer>
          {tempLocation && (
            <div className="mt-3">
              <p><strong>Selected Latitude:</strong> {tempLocation.latitude}</p>
              <p><strong>Selected Longitude:</strong> {tempLocation.longitude}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={confirmLocation}>Confirm Location</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;