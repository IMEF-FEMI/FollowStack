import { combineReducers } from "redux";
import authReducer from "./authReducer";
import snackbarReducer from "./snackbarReducer";
import drawerReducer from "./drawerReducer";
import notistackReducer from "./notistackReducer";
import usersReducer from "./usersReducer";
import profileReducer from "./profileReducer";
import viewTweetsReducer from "./viewTweetsReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
  notistack: notistackReducer,
  drawer: drawerReducer,
  users: usersReducer,
  myProfile: profileReducer,
  viewTweets: viewTweetsReducer,
  errors: errorReducer
});
