import React, { useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { checkManagerIdExists, updateUser } from "../../Services/Users"; 

const ManagerIdModal = ({ employee, show, onClose, onUpdate }) => {
    const [managerId, setManagerId] = useState("");
    const [error, setError] = useState("");

    const handleSave = async () => {
        if (!managerId.trim()) {
            setError("Manager ID is required.");
            return;
        }

        const managerExists = await checkManagerIdExists(managerId,employee.id);
        if (!managerExists) {
            setError("Enter a valid Manager ID.");
            return;
        }

        const updatedEmployee = {
            ...employee,
            managerId,
            LoginSessions: [],
        };

        await updateUser(employee.email, "employee", updatedEmployee);

        
        onUpdate(updatedEmployee);
        onClose();
    };

    return (
        <Modal show={show} centered backdrop="static" keyboard={false}>
            <Modal.Body className="text-center">
                <Image
                    src="https://as2.ftcdn.net/jpg/02/09/79/01/1000_F_209790157_lni2Rip3Dm1YrTNPW6jCuSI6sIADbrKD.jpg"
                    alt="Manager Avatar"
                    className="mb-3"
                    roundedCircle
                    width={100}
                    height={100}
                />

                <h4 className="mb-3">Enter Your Manager ID</h4>

                <Form.Group>
                    <Form.Control
                        type="text"
                        value={managerId}
                        onChange={(e) => setManagerId(e.target.value)}
                        isInvalid={!!error}
                    />
                    <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSave}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ManagerIdModal;
