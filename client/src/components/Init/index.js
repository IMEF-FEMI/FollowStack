import jwt_decode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken";
import {
  setCurrentUser,
  logoutUser,
  setUserProfile,
  setKeyInUse,
  setPointsAction,
  setPoints
} from "../../actions/authActions";
import { SET_USER_DATA, SET_USER_PROFILE } from "../../actions/types";
import {
  onSnackbarOpen,
  setSnackbarMessage,
  setSnackbarVariant
} from "../../actions/snackbarAction";
import {setNotifications} from "../../actions/notificationAction"
import store from "../../store";

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

  const userInfo = store.getState().auth
  socket.emit("get-notifications", userInfo.user.userid, notifications => {
    // console.log(notifications)
  store.dispatch(setNotifications(notifications));

  })
  socket.on("get-user-info", (info, callback) => {
    callback({
      user_id: userInfo.user.userid,
      photo: userInfo.userData.photo,
      screen_name: userInfo.userProfile.screen_name
    });
  });

  socket.on("followed", res => {
    store.dispatch(setSnackbarMessage(res.user));
    store.dispatch(setSnackbarVariant("followed"));
    store.dispatch(onSnackbarOpen());
  });
};
export const initSignIn = socket => {
  initKeyInUse();


  // go-online using socketIO
  initSocket(socket);
  const userInfo = store.getState().auth;
  socket.emit("push-user-info",{
      user_id: userInfo.user.userid,
      photo: userInfo.userData.photo,
      screen_name: userInfo.userProfile.screen_name
    }
  );
  if(!store.getState().auth.user._id){
  store.dispatch(setPointsAction(100));
}else{
  store.dispatch(setPointsAction(store.getState().auth.user._id));
}
};
export const initKeyInUse = () => {
  // init keyInUse
  if (localStorage.getItem("keyInUse") === undefined ||
      localStorage.getItem("keyInUse") === null) {
    const randomNumber = Math.floor(Math.random() * 4);
    localStorage.setItem("keyInUse", randomNumber);
    store.dispatch(setKeyInUse(randomNumber));
  } else {
    const key = localStorage.getItem("keyInUse");
    store.dispatch(setKeyInUse(key));
  }
};
