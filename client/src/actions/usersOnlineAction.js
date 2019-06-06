import {
  SET_ONLINE_USERS,
  UO_SET_FOLLOWED_BACK,
  UO_SET_HAS_FOLLOWINGS,
  UO_SET_HAS_FOLLOWINGS_TIME,
  UO_SET_CHECKING_FOLLOWINGS,
  UO_SET_CHECKING_FOLLOWED_BACK,
  UO_SET_CHECKING_NOT_FOLLOWED_BACK,
  UO_SET_NOT_FOLLOWING_BACK,
  UO_SET_GETTING_USERS,
  UO_SET_LINEAR_PROGRESS_BAR_COMPLETED,
  UO_SET_IS_UNFOLLOWING,
  UO_GET_ERRORS,
  UO_CLEAR_ERRORS
} from "./types";

import {
  getOnlineUsers,
  finishUnFollow,
  checkFollowing,
  checkFollowedBack,
  getNotFollowingBack
} from "../async/usersOnline";

export const getOnlineUsersAction = (userData, key) => async dispatch => {
  // sett isfollowing as true
  dispatch(setGettingUsers(true));
  try {
    var followings = await getOnlineUsers(userData, key);
    dispatch({
      type: UO_SET_LINEAR_PROGRESS_BAR_COMPLETED,
      payload: 100
    });
    // save te returned list of users
    dispatch({
      type: SET_ONLINE_USERS,
      payload: followings.data
    });
    dispatch(setGettingUsers(false)); //set isFollowing to false
    dispatch({
      type: UO_SET_HAS_FOLLOWINGS,
      payload: true
    });
  } catch (err) {
    dispatch({
      type: UO_GET_ERRORS,
      payload:
        err.response === undefined
          ? "Server Error Try Again"
          : err.response.data
    });
  }
};

export const finishedUnFollowAction = (userData) => async dispatch => {
  await finishUnFollow(userData);
  dispatch({
    type: SET_ONLINE_USERS,
    payload: []
  });
  dispatch({
    type: UO_SET_HAS_FOLLOWINGS,
    payload: false
  });
};



export const checkFollowingAction = userId => async dispatch => {
  // to know when the checking has begun
  dispatch(setCheckingFollowing(true));
  try {
    var hasFollowings = await checkFollowing(userId);
    // console.log("We here ",hasFollowings.data)
    if (hasFollowings !== undefined) {
      // set true or false if user already has som accounts bieng followed and the time
      dispatch({
        type: UO_SET_HAS_FOLLOWINGS,
        payload: hasFollowings.data.hasFollowings
      });
      dispatch({
        type: UO_SET_HAS_FOLLOWINGS_TIME,
        payload: hasFollowings.data.date
      });
      
      if (hasFollowings.data.followings.length > 0) {
        // to indicate that user has already been followed 
        hasFollowings.data.followings.forEach(element => {
          element.following = true;
        });
      }
      dispatch({
        type: SET_ONLINE_USERS,
        payload: hasFollowings.data.followings
      });
    } else {
      var errors = {};
      errors.serverError = "Server Error Try Again";
      dispatch({
        type: UO_GET_ERRORS,
        payload: errors
      });
    }
  } catch (err) {
    var error = {};
    error.serverError = "Server Error Try Again";

    dispatch({
      type: UO_GET_ERRORS,
      payload:
        err === undefined || err.response === undefined
          ? error
          : err.response.data
    });
  }

  // to know when the checking finished
  dispatch(setCheckingFollowing(false));
};

export const checkFollowedBackAction = (userId, key) => async dispatch => {
  dispatch(setCheckingFollowedBack(true));

  try {
    var followedBack = await checkFollowedBack(userId, key);
    if (followedBack !== undefined) {
      dispatch(setFollowedBackData(followedBack.data));
    }
  } catch (err) {
    var errors = {};
    errors.serverError = "Server Error Try Again";
    dispatch({
      type: UO_GET_ERRORS,
      payload: err.response === undefined ? errors : err.response.data
    });
  }

  dispatch(setCheckingFollowedBack(false));
};

export const getNotFollowingBackAction = (userId, key) => async dispatch => {
  dispatch(setCheckingNotFollowedBack(true));

  try {
    var notFollowingBack = await getNotFollowingBack(userId, key);
    if (notFollowingBack !== undefined) {
      if (notFollowingBack.data.length > 0) {
        // to indicate that user has already been followed 
        notFollowingBack.data.forEach(element => {
          element.following = true;
        });
      }
      dispatch(setNotFollowingBackData(notFollowingBack.data));
    }
  } catch (err) {
    var errors = {};
    errors.serverError = "Server Error Try Again";
    dispatch({
      type: UO_GET_ERRORS,
      payload: err.response === undefined ? errors : err.response.data
    });
  }

  dispatch(setCheckingNotFollowedBack(false));
}

export const setProgress = progressValue => async dispatch => {
  dispatch({
    type: UO_SET_LINEAR_PROGRESS_BAR_COMPLETED,
    payload: progressValue
  });
};

export const clearError = () => async dispatch => {
  dispatch({
    type: UO_CLEAR_ERRORS
  });
  dispatch({
    type: UO_SET_LINEAR_PROGRESS_BAR_COMPLETED,
    payload: 0
  });
  dispatch({
    type: UO_SET_GETTING_USERS,
    payload: false
  });
  dispatch({
    type: UO_SET_IS_UNFOLLOWING,
    payload: false
  });
  dispatch({
    type: SET_ONLINE_USERS,
    payload: []
  });
  dispatch({
    type: UO_SET_HAS_FOLLOWINGS,
    payload: false
  });
  dispatch({
    type: UO_SET_HAS_FOLLOWINGS_TIME,
    payload: ""
  });
  dispatch({
    type: UO_SET_FOLLOWED_BACK,
    payload: []
  });
  dispatch(setCheckingFollowing(false));
};

export const setCheckingFollowing = val => {
  return {
    type: UO_SET_CHECKING_FOLLOWINGS,
    payload: val
  };
};

export const setCheckingFollowedBack = val => {
  return {
    type: UO_SET_CHECKING_FOLLOWED_BACK,
    payload: val
  };
};

export const setCheckingNotFollowedBack = val => {
  return {
    type: UO_SET_CHECKING_NOT_FOLLOWED_BACK,
    payload: val
  };
}

export const setFollowedBackData = data => {
  return {
    type: UO_SET_FOLLOWED_BACK,
    payload: data
  };
};

export const setNotFollowingBackData = data =>{
  return {
    type: UO_SET_NOT_FOLLOWING_BACK,
    payload: data
  };
}
export const setGettingUsers = val => {
  return {
    type: UO_SET_GETTING_USERS,
    payload: val
  };
};
