import {
  SET_FOLLOWINGS,
  SET_FOLLOWED_BACK,
  SET_STATS,
  SET_HAS_FOLLOWINGS,
  SET_HAS_FOLLOWINGS_TIME,
  SET_CHECKING_FOLLOWINGS,
  SET_CHECKING_FOLLOWED_BACK,
  SET_IS_FOLLOWING,
  SET_LINEAR_PROGRESS_BAR_COMPLETED,
  SET_IS_UNFOLLOWING,
  SET_TOTAL_GAINED,
  GET_ERRORS,
  CLEAR_ERRORS
} from "./types";

import {
  gainFollowers,
  beginUnFollow,
  checkFollowing,
  checkFollowedBack,
  checkTotalGained
} from "../async/twitter";

export const gainFollowersAction = userData => async dispatch => {
  // sett isfollowing as true
  dispatch(setIsFollowing(true));
  try {
    var followings = await gainFollowers(userData);
    dispatch({
      type: SET_LINEAR_PROGRESS_BAR_COMPLETED,
      payload: 100
    });
    // save te returned list of users
    dispatch({
      type: SET_FOLLOWINGS,
      payload: followings.data.followedUsers
    });
    var hasFollowings = await checkFollowing(userData.userid);
    if (hasFollowings !== undefined) {
      dispatch({
        type: SET_HAS_FOLLOWINGS_TIME,
        payload: hasFollowings.data.date
      });
    }

    dispatch(setIsFollowing(false)); //set isFollowing to false
    dispatch({
      type: SET_HAS_FOLLOWINGS,
      payload: true
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload:
        err.response === undefined
          ? "Server Error Try Again"
          : err.response.data
    });
  }
};

export const beginUnFollowAction = userData => async dispatch => {
  dispatch(setIsUnFollowing(true));
  const res = await beginUnFollow(userData);
  dispatch(setStats(res.data.stats));
  dispatch(setTotalGained(res.data.stats.totalGained))
  dispatch(setIsUnFollowing(false));
  dispatch({
      type: SET_FOLLOWINGS,
      payload: []
  })
  dispatch({
    type: SET_HAS_FOLLOWINGS,
    payload: false
  })
  
};

export const checkFollowingAction = userId => async dispatch => {
  // to know when the checking has begun
  dispatch(setCheckingFollowing(true));
  try {
    var hasFollowings = await checkFollowing(userId);

    if (hasFollowings !== undefined) {
      // set true or false if user already has som accounts bieng followed and the time
      dispatch({
        type: SET_HAS_FOLLOWINGS,
        payload: hasFollowings.data.hasFollowings
      });
      dispatch({
        type: SET_HAS_FOLLOWINGS_TIME,
        payload: hasFollowings.data.date
      });
      dispatch({
        type: SET_FOLLOWINGS,
        payload: hasFollowings.data.followings
      });
    } else {
      var errors = {};
      errors.serverError = "Server Error Try Again";
      dispatch({
        type: GET_ERRORS,
        payload: errors
      });
    }
  } catch (err) {
    var error = {};
    error.serverError = "Server Error Try Again";

    dispatch({
      type: GET_ERRORS,
      payload:
        err === undefined || err.response === undefined
          ? error
          : err.response.data
    });
  }

  // to know when the checking finished
  dispatch(setCheckingFollowing(false));
};

export const checkFollowedBackAction = userId => async dispatch => {
  dispatch(setCheckingFollowedBack(true));

  try {
    var followedBack = await checkFollowedBack(userId);
    if (followedBack !== undefined) {
      dispatch(setFollowedBackData(followedBack.data));
    }
  } catch (err) {
    var errors = {};
    errors.serverError = "Server Error Try Again";
    dispatch({
      type: GET_ERRORS,
      payload: err.response === undefined ? errors : err.response.data
    });
  }

  dispatch(setCheckingFollowedBack(false));
};



export const checkTotalGainedAction  = userId => async dispatch =>{
  const totalGained = await checkTotalGained(userId)
  dispatch(setTotalGained(totalGained.data.totalGained))
}

export const setProgress = progressValue => async dispatch => {
  dispatch({
    type: SET_LINEAR_PROGRESS_BAR_COMPLETED,
    payload: progressValue
  });
};

export const clearError = () => async dispatch => {
  dispatch({
    type: CLEAR_ERRORS
  });
  dispatch({
    type: SET_LINEAR_PROGRESS_BAR_COMPLETED,
    payload: 0
  });
  dispatch({
    type: SET_IS_FOLLOWING,
    payload: false
  });
  dispatch({
    type: SET_IS_UNFOLLOWING,
    payload: false
  });
  dispatch({
    type: SET_FOLLOWINGS,
    payload: []
  });
  dispatch({
    type: SET_HAS_FOLLOWINGS,
    payload: false
  });
  dispatch({
    type: SET_HAS_FOLLOWINGS_TIME,
    payload: ""
  });
  dispatch({
    type: SET_FOLLOWED_BACK,
    payload: []
  });
  dispatch(setCheckingFollowing(false));
};

export const setCheckingFollowing = val => {
  return {
    type: SET_CHECKING_FOLLOWINGS,
    payload: val
  };
};

export const setCheckingFollowedBack = val => {
  return {
    type: SET_CHECKING_FOLLOWED_BACK,
    payload: val
  };
};

export const setFollowedBackData = data => {
  return {
    type: SET_FOLLOWED_BACK,
    payload: data
  };
};
export const setIsFollowing = val => {
  return {
    type: SET_IS_FOLLOWING,
    payload: val
  };
};
export const setIsUnFollowing = val => {
  return {
    type: SET_IS_UNFOLLOWING,
    payload: val
  };
};
export const setStats = val => {
  return {
    type: SET_STATS,
    payload: val
  };
};
export const setTotalGained = gains =>{
  return{
    type: SET_TOTAL_GAINED,
    payload: gains
  }
}
