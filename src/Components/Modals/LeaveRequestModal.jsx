import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Calendar, Check, X } from 'lucide-react';

const LeaveRequestsModal = ({ show, onHide, employee, onLeaveAction }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            keyboard={false}
            centered
            className="leave-request-modal"
        >
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    <Calendar size={20} className="me-2" />
                    Leave Requests
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {employee && (
                    <div>
                        <h5 className="mb-3 text-center border-bottom pb-2">
                            {employee.name.toUpperCase()}
                        </h5>
                        
                        {employee.leaveRequests && employee.leaveRequests.length > 0 ? (
                            <div className="leave-requests-list">
                                {employee.leaveRequests.map((date, index) => (
                                    <div key={index} className="d-flex justify-content-between align-items-center p-2 mb-2 border-bottom">
                                        <div className="d-flex align-items-center">
                                            <Calendar size={16} className="me-2 text-primary" />
                                            <span className="fw-bold">{formatDate(date)}</span>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Button 
                                                variant="success" 
                                                size="sm" 
                                                onClick={() => onLeaveAction("approve", date)}
                                                className="d-flex align-items-center"
                                            >
                                                <Check size={16} className="me-1" /> Approve
                                            </Button>
                                            <Button 
                                                variant="danger" 
                                                size="sm" 
                                                onClick={() => onLeaveAction("reject", date)}
                                                className="d-flex align-items-center"
                                            >
                                                <X size={16} className="me-1" /> Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="mb-0 text-muted">No pending leave requests</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LeaveRequestsModal;