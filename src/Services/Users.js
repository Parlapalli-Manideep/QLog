import axios from "axios";
const BASE_URL = "http://localhost:3000/users";

export const getUsers = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const addUser = async (user)=> {
    await axios.post(BASE_URL, user);
}