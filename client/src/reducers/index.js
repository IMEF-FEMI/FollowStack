import { combineReducers } from "redux";
import authReducer from "./authReducer";
import gainFollowersReducer from "./gainFollowersReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  gainFollowers: gainFollowersReducer,
  errors: errorReducer
});
