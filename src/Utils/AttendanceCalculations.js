export const calculateWorkingHours = (loginTime, logoutTime) => {
    if (!loginTime || !logoutTime) return "N/A";

    const loginDate = new Date(loginTime); 
    const logoutDate = new Date(logoutTime);

    const totalMinutes = Math.floor((logoutDate.getTime() - loginDate.getTime()) / (1000 * 60));

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")} hrs`;
};

export const classifySession = (loginTime, logoutTime) => {
    if (!loginTime || !logoutTime) return "Incomplete Session";

    const loginDate = new Date(loginTime); 
    const logoutDate = new Date(logoutTime);

    const workMinutes = Math.floor((logoutDate.getTime() - loginDate.getTime()) / (1000 * 60));

    if (workMinutes < 480) return "Early Logout";  
    if (workMinutes > 510) return "OT"; 
    return "Normal";
};


export const filterSessions = (sessions, startDate, endDate, sessionType) => {
    const adjustedEndDate = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;

    return sessions
        .filter(({ logoutTime }) => logoutTime) 
        .filter(({ loginTime }) => {
            const date = new Date(loginTime);
            return (!startDate || date >= startDate) && (!adjustedEndDate || date <= adjustedEndDate);
        })
        .filter(({ loginTime, logoutTime }) => {
            if (sessionType === "All Sessions") return true;
            const workMinutes = (new Date(logoutTime) - new Date(loginTime)) / (1000 * 60); 
            if (sessionType === "Early Logout") return workMinutes < 480; 
            if (sessionType === "OT") return workMinutes > 510; 
            if (sessionType === "Normal") return workMinutes >= 480 && workMinutes <= 510; 
            return true;
        });
};


export const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};
