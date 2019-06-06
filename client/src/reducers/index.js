import { combineReducers } from "redux";
import authReducer from "./authReducer";
import gainFollowersReducer from "./gainFollowersReducer";
import usersOnlineReducer from "./usersOnlineReducer";
import profileReducer from "./profileReducer";
import viewTweetsReducer from "./viewTweetsReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  gainFollowers: gainFollowersReducer,
  usersOnline: usersOnlineReducer,
  myProfile: profileReducer,
  viewTweets: viewTweetsReducer,
  errors: errorReducer
});
