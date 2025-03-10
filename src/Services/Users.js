import axios from "axios";

const BASE_URL = "http://localhost:3000/users";

export const getUsers = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const addUser = async (user) => {
  await axios.post(BASE_URL, user);
};

export const checkUserExists = async (email) => {
  const users = await getUsers();
  return users.some(user => user.email === email);
};

export const checkCredentials = async (email,password,role) => {
  const users = await getUsers();
  return users.some(user => user.email === email && user.password === password && user.role === role);
};
export const checkGoogleCredentials = async (email,role) => {
  const users = await getUsers();
  return users.some(user => user.email === email && user.role === role);
};

export const getUserData = async (email) => {
  const users = await getUsers();  
  return users.find(user => user.email === email);
};

export const updateUser = async (email, updatedFields) => {
  const users = await getUsers();
  const user = users.find(user => user.email === email);

  if (!user) return null;

  const response = await axios.patch(`${BASE_URL}/${user.id}`, updatedFields);
  return response.data;
};