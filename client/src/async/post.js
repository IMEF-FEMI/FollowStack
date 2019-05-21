import axios from "axios"

export const fetchTweetsForProfile = async ( userData, key, cancelToken)=> {
    const res = await axios.post(`/api/post/get-profile-tweets/${key}`, userData, {cancelToken});
    return res;
  };
//   export const fetchForProfile = async userid => {
//     const res = await axios.get(`/api/twitter/check-total-gained/${userid}`);
//     return res;
//   };