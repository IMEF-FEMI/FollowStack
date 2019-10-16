import {
  SET_USERS_PAGE,
  SET_USERS,
  SET_USERS_INITIAL_FETCH,
  SET_USERS_IS_FETCHING,
  SET_USERS_HAS_MORE,
  REFRESH_ONLINE,
  UPDATE_USER,
  UPDATE_UNFOLLOW_USER
} from "./types";

import Button from "@material-ui/core/Button";
import React from "react";
import { enqueueSnackbar, closeSnackbar } from "./notistackActions";

export const updateUser = user => async dispatch => {
  dispatch({
    type: UPDATE_USER,
    payload: user
  });
};

export const updateUnfollowUser = user => async dispatch => {
  dispatch({
    type: UPDATE_UNFOLLOW_USER,
    payload: user
  });
};

export const refreshOnlineAction = () => async dispatch => {
  dispatch({
    type: REFRESH_ONLINE
  });
};
export const initialFetchAction = socket => async dispatch => {
  socket.emit("get-users", data => {
    if (data.users) {
      dispatch(setUsers(data.users));
      dispatch(setPage(1));
      dispatch(setInitialFetch(false));
      if (data.users.length === 0 || data.users.length === 1) {
        dispatch(setHasMore(false));
      }
    } else {
      // error message

      dispatch(
        enqueueSnackbar({
          message: data.error,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: "error",
            action: key => (
              <Button
                style={{ color: "#fff" }}
                onClick={() => dispatch(closeSnackbar(key))}
              >
                dismiss
              </Button>
            )
          }
        })
      );
    }
  });
};

export const fetchNextAction = (socket, page) => async dispatch => {
  dispatch(setIsFetching(true));
  socket.emit("get-users", data => {
    if (data.users) {
      if (!data.users.length) {
        dispatch(setHasMore(false));
        dispatch(setIsFetching(false));
      } else {
        dispatch(setIsFetching(false));
        dispatch(setPage(page + 1));
        dispatch(setUsers(data.users));
      }
    } else {
      // error message
      dispatch(
        enqueueSnackbar({
          message: data.error,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: "error",
            action: key => (
              <Button
                style={{ color: "#fff" }}
                onClick={() => dispatch(closeSnackbar(key))}
              >
                dismiss
              </Button>
            )
          }
        })
      );
    }
  });
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
