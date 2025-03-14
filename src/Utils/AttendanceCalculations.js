// export const calculateWorkingHours = (loginTime, logoutTime) => {
//     if (!loginTime || !logoutTime) return "N/A";
    
//     const loginDate = new Date(loginTime);
//     const logoutDate = new Date(logoutTime);
//     const workHours = (logoutDate - loginDate) / (1000 * 60 * 60);
    
//     return workHours.toFixed(2) + " hrs";
// };

export const calculateWorkingHours = (loginTime, logoutTime) => {
    if (!loginTime || !logoutTime) return "N/A";

    const loginDate = new Date(loginTime);
    const logoutDate = new Date(logoutTime);
    const totalMinutes = Math.floor((logoutDate - loginDate) / (1000 * 60)); // Convert milliseconds to total minutes

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")} hrs`;
};

export const classifySession = (loginTime, logoutTime) => {
    if (!loginTime || !logoutTime) return "Incomplete Session";

    const workMinutes = (new Date(logoutTime) - new Date(loginTime)) / (1000 * 60);

    if (workMinutes < 480) return "Early Logout";
    if (workMinutes > 510) return "OT";
    return "Normal";
};


// export const filterSessions = (sessions, startDate, endDate, sessionType) => {
//     return sessions
//         .filter(({ logoutTime }) => logoutTime) 
//         .filter(({ loginTime }) => {
//             const date = new Date(loginTime);
//             return (!startDate || date >= startDate) && (!endDate || date <= endDate);
//         })
//         .filter(({ loginTime, logoutTime }) => {
//             const workMinutes = (new Date(logoutTime) - new Date(loginTime)) / (1000 * 60); 
            
//             if (sessionType === "Early Logout") return workMinutes < 480; 
//             if (sessionType === "OT") return workMinutes > 510; 
//             if (sessionType === "Normal") return workMinutes >= 480 && workMinutes <= 510; 
//             return true; 
//         });
// };

export const filterSessions = (sessions, startDate, endDate, sessionType) => {
    return sessions
        .filter(({ logoutTime }) => logoutTime) // Ensure session is completed
        .filter(({ loginTime }) => {
            const date = new Date(loginTime);
            return (!startDate || date >= startDate) && (!endDate || date <= endDate);
        })
        .filter(({ loginTime, logoutTime }) => {
            if (sessionType === "All Sessions") return true; // ✅ Allow all sessions when "All Sessions" is selected

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
