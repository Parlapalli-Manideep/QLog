import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalComponent = ({ title, message, show, onClose, onConfirm }) => {
    return (
        <Modal show={show} centered backdrop={true} keyboard={true} onHide={onClose}>
            <Modal.Header >
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="danger" onClick={onConfirm}>Logout</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalComponent;
