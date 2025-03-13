export const calculateWorkingHours = (loginTime, logoutTime) => {
    if (!loginTime || !logoutTime) return "N/A";
    
    const loginDate = new Date(loginTime);
    const logoutDate = new Date(logoutTime);
    const workHours = (logoutDate - loginDate) / (1000 * 60 * 60);
    
    return workHours.toFixed(2) + " hrs";
};

export const classifySession = (loginTime, logoutTime) => {
    if (!loginTime || !logoutTime) return "N/A";

    const workHours = (new Date(logoutTime) - new Date(loginTime)) / (1000 * 60 * 60);
    
    if (workHours < 8) return "Early Logout";
    if (workHours > 9) return "OT";
    return "Normal";
};

export const filterSessions = (sessions, startDate, endDate, sessionType) => {
    return sessions
        .filter(({ logoutTime }) => logoutTime)
        .filter(({ loginTime }) => {
            const date = new Date(loginTime);
            return (!startDate || date >= startDate) && (!endDate || date <= endDate);
        })
        .filter(({ loginTime, logoutTime }) => {
            const workHours = (new Date(logoutTime) - new Date(loginTime)) / (1000 * 60 * 60);
            if (sessionType === "Early Logout") return workHours < 8;
            if (sessionType === "OT") return workHours > 9;
            if (sessionType === "Normal") return workHours >= 8 && workHours <= 9;
            return true;
        });
};
