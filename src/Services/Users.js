// import axios from "axios";

// const BASE_URL = "http://localhost:3000/";

// export const getEmployees = async () => {
//   const employee = await axios.get(`${BASE_URL}employee`);
//   return employee.data;
// };
// export const getManagers = async () => {
//   const manager = await axios.get(`${BASE_URL}manager`);
//   return manager.data;
// };
// export const getUsers = async () => {
//   const employee = await getEmployees()
//   const manager = await getManagers()
//   return [...employee,...manager];
// };


// export const addUser = async (user) => {
//   await axios.post(BASE_URL+user.role, user);
// };

// export const checkUserExists = async (email) => {
//   const users = await getUsers();
//   return users.some(user => user.email === email);
// };

// export const checkCredentials = async (email,password,role) => {
//   const users = role == "employee" ? await getEmployees() : await getManagers();
//   return users.some(user => user.email === email && user.password === password);
// };

// export const checkGoogleCredentials = async (email,role) => {
//   const users = role == "employee" ? await getEmployees() : await getManagers();
//   return users.some(user => user.email === email);
// };

// export const getUserData = async (email,role) => {
//   const users = role == "employee" ? await getEmployees() : await getManagers();
//   return users.find(user => user.email === email);
// };

// export const updateUser = async (email,role,updatedFields) => {
//   const users = role == "employee" ? await getEmployees() : await getManagers();
//   const user = users.find(user => user.email === email);
//   if (!user) return null;
//   const response = await axios.patch(`${BASE_URL+role}/${user.id}`, updatedFields);
//   return response.data;
// };

// export const checkManagerIdExists = async (managerId,employeeId) => {
//     const managers = await getManagers();
//     const managerdata = managers.find(manager => manager.id === managerId);  
//     if(managerdata){
//       managerdata.staff.push(employeeId)
//       await axios.patch(`${BASE_URL}manager/${managerId}`,managerdata)
//       return true
//     }
//     return false
// }

// export const getUserByEmail = async (email , role) => {
//   const users = role == "employee" ? await getEmployees() : await getManagers();
//   return users.find(user => user.email === email) || null;
// };
// export const getUserById = async (id , role) => {
//   const users = role == "employee" ? await getEmployees() : await getManagers();
//   return users.find(user => user.id === id) || null;
// };
// //--
// export const getEmployeeLeaves = async (employeeId) => {
//   try {
//     const response = await axios.get(`${BASE_URL}leaves/${employeeId}`);
//     const year = new Date().getFullYear().toString(); // Get current year as a string
//     const leaves = response.data || {};

//     // If the current year doesn't exist in the leaves data, initialize it
//     if (!leaves[year]) {
//       leaves[year] = [];
//     }
//     console.log("users-->",leaves)
//     return leaves;
//   } catch (error) {
//     console.error("Error fetching employee leaves:", error);
//     return { [new Date().getFullYear().toString()]: [] }; // Return empty year data if error occurs
//   }
// };


import axios from "axios";

const BASE_URL = "http://localhost:3000/";

export const getEmployees = async () => {
  const employee = await axios.get(`${BASE_URL}employee`);
  return employee.data;
};
export const getManagers = async () => {
  const manager = await axios.get(`${BASE_URL}manager`);
  return manager.data;
};
export const getUsers = async () => {
  const employee = await getEmployees()
  const manager = await getManagers()
  return [...employee,...manager];
};


export const addUser = async (user) => {
  await axios.post(BASE_URL+user.role, user);
};

export const checkUserExists = async (email) => {
  const users = await getUsers();
  return users.some(user => user.email === email);
};

export const checkCredentials = async (email,password,role) => {
  const users = role == "employee" ? await getEmployees() : await getManagers();
  return users.some(user => user.email === email && user.password === password);
};

export const checkGoogleCredentials = async (email,role) => {
  const users = role == "employee" ? await getEmployees() : await getManagers();
  return users.some(user => user.email === email);
};

export const getUserData = async (email,role) => {
  const users = role == "employee" ? await getEmployees() : await getManagers();
  return users.find(user => user.email === email);
};

export const updateUser = async (email,role,updatedFields) => {
  const users = role == "employee" ? await getEmployees() : await getManagers();
  const user = users.find(user => user.email === email);
  if (!user) return null;
  const response = await axios.patch(`${BASE_URL+role}/${user.id}`, updatedFields);
  return response.data;
};

export const checkManagerIdExists = async (managerId,employeeId) => {
    const managers = await getManagers();
    const managerdata = managers.find(manager => manager.id === managerId);  
    if(managerdata){
      managerdata.staff.push(employeeId)
      await axios.patch(`${BASE_URL}manager/${managerId}`,managerdata)
      return true
    }
    return false
}

export const getUserByEmail = async (email , role) => {
  const users = role == "employee" ? await getEmployees() : await getManagers();
  return users.find(user => user.email === email) || null;
};
export const getUserById = async (id , role) => {
  const users = role == "employee" ? await getEmployees() : await getManagers();
  return users.find(user => user.id === id) || null;
};

export const getEmployeeLeaves = async (employeeId) => {
  try {
    // Get the employee data
    const employee = await getUserById(employeeId, "employee");
    
    // If the employee has Leaves data, use it; otherwise, initialize an empty object
    const leaves = employee?.Leaves || {};
    
    // Ensure the current year exists
    const currentYear = new Date().getFullYear().toString();
    if (!leaves[currentYear]) {
      leaves[currentYear] = [];
    }
    
    return leaves;
  } catch (error) {
    console.error("Error fetching employee leaves:", error);
    // Return an empty structure on error
    return { [new Date().getFullYear().toString()]: [] };
  }
};