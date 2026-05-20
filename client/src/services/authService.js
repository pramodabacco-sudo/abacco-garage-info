import API from "../api/axios";

export const loginUser = async (data) => {
  const response = await API.post("/api/auth/login", data);
  return response.data;
};