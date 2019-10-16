import jwt_decode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken";
import React from "react";

import {
  setCurrentUser,
  logoutUser,
  setUserProfile,
  setKeyInUse,
  setPointsAction,
  setPoints
} from "../../actions/authActions";
import { SET_USER_DATA, SET_USER_PROFILE } from "../../actions/types";

import { updateUser, updateUnfollowUser } from "../../actions/usersAction";
import { enqueueSnackbar, closeSnackbar } from "../../actions/notistackActions";
import store from "../../store";
import CustomSnackbar from "../CustomSnackbar/Notifier/Snackbar";

export const initApp = socket => {
  initKeyInUse();
  // localStorage.clear();
  // Check for token
  if (localStorage.jwtToken) {
    // Set auth token header auth
    setAuthToken(localStorage.jwtToken);
    // Decode token and get user info and exp
    const decoded = jwt_decode(localStorage.jwtToken);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
    store.dispatch({
      type: SET_USER_DATA,
      payload: JSON.parse(localStorage.getItem("userData"))
    });

    store.dispatch({
      type: SET_USER_PROFILE,
      payload: JSON.parse(localStorage.getItem("userProfile"))
    });
    store.dispatch(
      setUserProfile(
        store.getState().auth.userData,
        localStorage.getItem("keyInUse")
      )
    );

    // go-online using socketIO
    initSocket(socket);

    if (localStorage.getItem("points")) {
      store.dispatch(setPoints(localStorage.getItem("points")));
    }
    store.dispatch(setPointsAction(store.getState().auth.user._id));
    // Check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Logout user
      store.dispatch(logoutUser());
    }
  }
};

export const initSocket = socket => {
  const userInfo = store.getState().auth;

  socket.on("get-user-info", (info, callback) => {
    callback({
      user_id: userInfo.user.userid,
      photo: userInfo.userData.photo,
      screen_name: userInfo.userProfile.screen_name,
      accessToken: userInfo.userData.accessToken,
      secret: userInfo.userData.secret,
      keyInUse: localStorage.getItem("keyInUse")
    });
  });

  socket.on("followed", res => {
    if (res === undefined) {
      return;
    }
    store.dispatch(
      enqueueSnackbar({
        options: {
          key: new Date().getTime() + Math.random(),
          children: key => (
            <CustomSnackbar
              variant={"followed"}
              user={res.user}
              id={key}
              handleDismiss={() => {
                store.dispatch(closeSnackbar(key));
              }}
            />
          )
        }
      })
    );
  });

  socket.on("followedback", res => {
    if (res === undefined) {
      return;
    }
    store.dispatch(
      enqueueSnackbar({
        options: {
          key: new Date().getTime() + Math.random(),
          children: key => (
            <CustomSnackbar
              variant={"followedback"}
              user={res.user}
              id={key}
              handleDismiss={() => {
                store.dispatch(closeSnackbar(key));
              }}
            />
          )
        }
      })
    );
  });

  socket.on("unfollowingback", res => {
    if (res === undefined) {
      return;
    }
    store.dispatch(updateUnfollowUser(res.user));
  });

  socket.on("followingback", res => {
    if (res === undefined) {
      return;
    }
    store.dispatch(updateUser(res.user));
    store.dispatch(
      enqueueSnackbar({
        options: {
          key: new Date().getTime() + Math.random(),
          children: key => (
            <CustomSnackbar
              variant={"followingback"}
              user={res.user}
              id={key}
              handleDismiss={() => {
                store.dispatch(closeSnackbar(key));
              }}
            />
          )
        }
      })
    );
  });
};

export const initSignIn = socket => {
  initKeyInUse();

  // go-online using socketIO
  initSocket(socket);
  const userInfo = store.getState().auth;
  const screen_name = userInfo.userProfile.screen_name
    ? userInfo.userProfile.screen_name
    : userInfo.userData.username;

  socket.emit("push-user-info", {
    user_id: userInfo.user.userid,
    photo: userInfo.userData.photo,
    screen_name: screen_name,
    accessToken: userInfo.userData.accessToken,
    secret: userInfo.userData.secret,
    keyInUse: localStorage.getItem("keyInUse")
  });

  if (!store.getState().auth.user._id) {
    store.dispatch(setPointsAction(100));
  } else {
    store.dispatch(setPointsAction(store.getState().auth.user._id));
  }
};
export const initKeyInUse = () => {
  // init keyInUse
  if (
    localStorage.getItem("keyInUse") === undefined ||
    localStorage.getItem("keyInUse") === null
  ) {
    const randomNumber =
      process.env.NODE_ENV === "development"
        ? 4
        : Math.floor(Math.random() * 4);
    localStorage.setItem("keyInUse", randomNumber);
    store.dispatch(setKeyInUse(randomNumber));
  } else {
    const key = localStorage.getItem("keyInUse");
    store.dispatch(setKeyInUse(key));
  }
};
