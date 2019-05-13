import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  SET_USER_DATA,
  SET_USER_PROFILE
} from "./types";
import { registerUser, signInUser, getUserProfile } from "../async/auth";

// Register - Get User Token
export const register = userData => async dispatch => {
  let decoded;
  try {
    const res = await registerUser(userData);

    // Save to localStorage
    const { token } = res.data;
    // Set token to ls
    localStorage.setItem("jwtToken", token);
    // Set token to Auth header
    setAuthToken(token);
    // Decode token to get user data
    decoded = jwt_decode(token);
    // Set current user
    dispatch(setCurrentUser(decoded));
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const signIn = userData => async dispatch => {
  let decoded;
  try {
    const res = await signInUser(userData);

    // Save to localStorage
    const { token } = res.data;
    // Set token to ls
    localStorage.setItem("jwtToken", token);
    // Set token to Auth header
    setAuthToken(token);
    // Decode token to get user data
    decoded = jwt_decode(token);
    // Set current user
    dispatch(setCurrentUser(decoded));
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};
// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Set user data
export const setUserData = userData => async dispatch => {
  // Save to localStorage
  localStorage.setItem("userData", JSON.stringify(userData));
  // Set current user
  dispatch({
    type: SET_USER_DATA,
    payload: userData
  });
};

// Set user Profile
export const setUserProfile = userData => async dispatch => {
  const profile = await getUserProfile(userData);
  // Save to localStorage
  localStorage.removeItem("userProfile");
  localStorage.setItem("userProfile", JSON.stringify(profile.data));
  // Set current user
  dispatch({
    type: SET_USER_PROFILE,
    payload: profile.data
  });
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("userData");
  localStorage.removeItem("userProfile");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  dispatch({
    type: SET_USER_DATA,
    payload: {}
  });
};
