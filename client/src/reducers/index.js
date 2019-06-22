import { combineReducers } from "redux";
import authReducer from "./authReducer";
import notificationsReducer from "./notificationsReducer";
import snackbarReducer from "./snackbarReducer";
import usersOnlineReducer from "./usersOnlineReducer";
import profileReducer from "./profileReducer";
import viewTweetsReducer from "./viewTweetsReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
  notifications: notificationsReducer,
  usersOnline: usersOnlineReducer,
  myProfile: profileReducer,
  viewTweets: viewTweetsReducer,
  errors: errorReducer
});
