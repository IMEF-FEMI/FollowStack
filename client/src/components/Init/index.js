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
  onSnackbarClose,
  setSnackbarMessage,
  setSnackbarVariant
} from "../../actions/snackbarAction";
import {updateUser} from "../../actions/usersAction"
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

  socket.on("followed", (res) => {
    if (res=== undefined) {
      return
    }
    setTimeout(()=>{
    store.dispatch(onSnackbarClose())
    store.dispatch(setSnackbarMessage(res.user));
    store.dispatch(setSnackbarVariant("followed"));
    store.dispatch(onSnackbarOpen());
  }, 3000)

  });

  socket.on("followedback", (res) => {
    if (res=== undefined) {
      return
    }
    setTimeout(()=>{
    store.dispatch(onSnackbarClose())
    store.dispatch(setSnackbarMessage(res.user));
    store.dispatch(setSnackbarVariant("followedback"));
    store.dispatch(onSnackbarOpen());
  }, 7000)
  });

  
  socket.on("followingback", res => {
    if (res=== undefined) {
      return
    }
    store.dispatch(updateUser(res.user))
    setTimeout(()=>{
    store.dispatch(onSnackbarClose())
    store.dispatch(setSnackbarMessage(res.user));
    store.dispatch(setSnackbarVariant("followingback"));
    store.dispatch(onSnackbarOpen());
  }, 7000)
    
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
      screen_name: userInfo.userProfile.screen_name,
      accessToken: userInfo.userData.accessToken,
      secret: userInfo.userData.secret,
      keyInUse: localStorage.getItem("keyInUse")
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
