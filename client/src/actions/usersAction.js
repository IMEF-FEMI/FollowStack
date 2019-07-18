import { 
  SET_USERS_PAGE,
  SET_USERS,
  SET_USERS_INITIAL_FETCH,
  SET_USERS_IS_FETCHING,
  SET_USERS_HAS_MORE,
  REFRESH_ONLINE,
  UPDATE_USER
} from "./types";

import {
  onSnackbarOpen,
  setSnackbarMessage,
  setSnackbarVariant
} from './snackbarAction'
export const updateUser = (user) => async dispatch => {
dispatch({
    type: UPDATE_USER,
    payload: user
  });

}


export const refreshOnlineAction = () => async dispatch => {
  dispatch({
    type: REFRESH_ONLINE
  });
};
export const initialFetchAction = (
  socket,
  currentUsers,
  page,
) => async dispatch => {
  socket.emit(
    "get-users",
    { currentUsers: currentUsers, page: page },
    data => {
      if (data.users) {
        dispatch(setUsers(data.users));
          dispatch(setPage(1));
          dispatch(setInitialFetch(false));
          if (data.users.length === 0 || data.users.length === 1) {
            dispatch(setHasMore(false));
          }
        }else{
          // error message
            dispatch(setSnackbarMessage(data.error))
            dispatch(setSnackbarVariant("error"))
            dispatch(onSnackbarOpen())
        }
    }
  );
};

export const fetchNextAction = (
  socket,
  currentUsers,
  page,
) => async dispatch => {
  dispatch(setIsFetching(true));
  socket.emit(
    "get-users",
    { currentUsers: currentUsers, page: page},
    data => {
      if (data.users) {
      if (!data.users.length) {
        dispatch(setHasMore(false));
        dispatch(setIsFetching(false));
      } else {
        dispatch(setIsFetching(false));
        dispatch(setPage(page + 1));
        dispatch(setUsers(data.users));
      }
    }else{
      // error message
            dispatch(setSnackbarMessage(data.error))
            dispatch(setSnackbarVariant("error"))
            dispatch(onSnackbarOpen())
    }
    }
  );
};
export const setInitialFetch = bool => {
  return {
    type: SET_USERS_INITIAL_FETCH,
    payload: bool
  };
};

export const setPage = page => {
  return {
    type: SET_USERS_PAGE,
    payload: page
  };
};

export const setUsers = pages => {
  return {
    type: SET_USERS,
    payload: pages
  };
};

export const setIsFetching = bool => {
  return {
    type: SET_USERS_IS_FETCHING,
    payload: bool
  };
};
export const setHasMore = bool => {
  return {
    type: SET_USERS_HAS_MORE,
    payload: bool
  };
};
