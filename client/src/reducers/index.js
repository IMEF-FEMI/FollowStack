import { combineReducers } from "redux";
import authReducer from "./authReducer";
import gainFollowersReducer from "./gainFollowersReducer";
import profileReducer from "./profileReducer";
import viewTweetsReducer from "./viewTweetsReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  gainFollowers: gainFollowersReducer,
  myProfile: profileReducer,
  viewTweets: viewTweetsReducer,
  errors: errorReducer
});
