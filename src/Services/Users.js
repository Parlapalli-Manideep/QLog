import axios from "axios";

export const BASE_URL = "http://localhost:3000/";

export const checkEmployeeExists = async (email) => {
  const employee = await axios.get(`${BASE_URL}employee/exists/${email}`)
  return employee.data.exists
};
export const checkManagerExists = async (email) => {
  const manager = await axios.get(`${BASE_URL}manager/exists/${email}`)
  return manager.data.exists
};
export const checkUserExists = async (email) => {
  const employee = await axios.get(`${BASE_URL}employee/exists/${email}`)
  const manager = await axios.get(`${BASE_URL}manager/exists/${email}`)

  return employee.data.exists || manager.data.exists
};
export const addUser = async (user) => {
  await axios.post(BASE_URL+user.role, user);
};
export const getId = async (email,role)=>
{
  const user = await axios.get(`${BASE_URL+role}/${email}`)
  return user.data
}

export const getUserById = async (id, role) => {
  const users = await axios.get(`${BASE_URL+role}/user/${id}`)
  return users.data
};

export const getEmployeeLeaves = async (employeeId) => {
  try {
    const response = await axios.get(`${BASE_URL}employee/${employeeId}/leaves`);
    return response.data;  
  } catch (error) {
    console.error("Error fetching employee leaves:", error);
    return [];  
  }
};

export const getManagers = async () => {
  const manager = await axios.get(`${BASE_URL}manager`);
  return manager.data;
};

export const updateUser = async (email, role, updatedFields) => {
  const response = await axios.patch(`${BASE_URL + role}/${email}`, updatedFields);
  return response.data;
};

export const deleteEmployeeFromManager = async (managerId, employeeId) => {
  try {
    const response = await axios.delete(`${BASE_URL}manager/${managerId}/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error deleting employee from manager: ${error.message}`);
  }
};

export const updateLoginSessions = async (id, updatedSessions) => {
  try {
    const response = await axios.patch(`${BASE_URL}/employee/${id}/login-sessions`, {
      loginSessions: updatedSessions,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating login sessions:", error);
    throw error;
  }
};

export const registerUser = async(userData)=>
{
  const user = await axios.get(`${BASE_URL}manager/register`,userData)
  return user.data;
}

export const checkCredentials = async (email, password, role) => {
  const user = await axios.get(`${BASE_URL}manager/login`,{email,password,role})
  return user.data;
};  

export const checkManagerIdExists = async (managerId, employeeId) => {
  try {
    const response = await axios.post(`${BASE_URL}manager/${managerId}/add-employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error adding employee to manager's staff:", error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${BASE_URL}employee/email/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee by email:", error);
    throw error;
  }
};









