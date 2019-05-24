import axios from "axios"

export const fetchTweetsForProfile = async ( userData, key, page, cancelToken)=> {
    const res = await axios.post(`/api/post/get-profile-tweets/${key}/${page}`, userData, {cancelToken});
    return res;
  };
//   export const fetchForProfile = async userid => {
//     const res = await axios.get(`/api/twitter/check-total-gained/${userid}`);
//     return res;
//   };