import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { firebaseKeys } from "../config";

import firebase from "firebase/app";
import "firebase/auth";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  SET_USER_DATA,
  SET_USER_PROFILE,
  SET_KEY
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

// set key in use
export const setKeyInUse = key => async dispatch => {
  dispatch({
    type: SET_KEY,
    payload: key
  });
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
export const setUserProfile = (userData, key) => async dispatch => {
  try {
    const profile = await getUserProfile(userData, key);
    // Save to localStorage
    localStorage.removeItem("userProfile");
    localStorage.setItem("userProfile", JSON.stringify(profile.data));
    // Set current user
    dispatch({
      type: SET_USER_PROFILE,
      payload: profile.data
    });
  } catch (err) {
    if (
      err.response &&
      err.response.data !== undefined &&
      err.response.data.errorCode !== undefined
    ) {
      if (parseInt(err.response.data.errorCode) === 89) {
        dispatch(logoutUser());
      }
    }
  }
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("userData");
  localStorage.removeItem("userProfile");

  firebase
    .auth()
    .signOut()
    .then(async function() {
      try {
        // Sign-out successful.
        firebase.apps.length = 0;
        localStorage.removeItem("keyInUse");

        const randomNumber = Math.floor(Math.random() * 4);
        await firebase.app('[DEFAULT]').delete();
        await firebase.initializeApp(firebaseKeys[randomNumber]);
        localStorage.setItem("keyInUse", randomNumber);
        dispatch(setKeyInUse(randomNumber));
      } catch (e) {
        console.log(e);
      }
    })
    .catch(function(error) {
      // An error happened
    });

  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  dispatch({
    type: SET_USER_DATA,
    payload: {}
  });
};
