import { useState } from "react";
import { updateUser } from "../../Services/Users";
import ManagerIdModal from "../../Components/Modals/ManagerIdModal";

function ManagerIdHandler({ userEmail, onManagerIdSet }) {
    const [showModal, setShowModal] = useState(true);

    const handleManagerIdSubmit = async (newManagerId) => {
        setShowModal(false);

        const qrData = `${userEmail}-${newManagerId}`;

        const updatedUser = await updateUser(userEmail, {
            managerId: newManagerId,
            loginSessions: [],
            qrCode: qrData,
        });

        onManagerIdSet(updatedUser);
    };

    return (
        <>
            {showModal && <ManagerIdModal onSubmit={handleManagerIdSubmit} />}
        </>
    );
}

export default ManagerIdHandler;