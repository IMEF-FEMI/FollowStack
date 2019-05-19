import axios from "axios";

export const registerUser = async userData => {
  const res = await axios.post("/api/users/register", userData);
  return res;
};
export const signInUser = async userData => {
  const res = await axios.post("/api/users/login", userData);
  return res;
};

export const checkUser = async id => {
  const res = await axios.get(`/api/users/check-user/${id}`);
  return res;
};

export const getUserProfile = async (userData, key) =>{
  const res = await axios.post(`/api/users/get-profile/${key}`, userData);
  return res;
}