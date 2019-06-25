import {
  SET_USERS_PAGE,
  SET_USERS,
  SET_USERS_INITIAL_FETCH,
  SET_USERS_IS_FETCHING,
  SET_USERS_HAS_MORE
} from "./types";

export const initialFetchAction = (
  socket,
  currentUsers,
  page,
  userData,
  key
) => async dispatch => {
  socket.emit(
    "get-users",
    { currentUsers: currentUsers, page: page, userData: userData, key: key },
    users => {
      dispatch(setUsers(users));
      dispatch(setPage(1));
      dispatch(setInitialFetch(false));
    }
  );
};

export const fetchNextAction = (
  socket,
  currentUsers,
  page,
  userData,
  key
) => async dispatch => {
  dispatch(setIsFetching(true));
  socket.emit(
    "get-users",
    { currentUsers: currentUsers, page: page, userData: userData, key: key },
    users => {
      if (!users.length) {
        dispatch(setHasMore(false));
        dispatch(setIsFetching(false));
      } else {
        dispatch(setIsFetching(false));
        dispatch(setPage(page + 1));
        dispatch(setUsers(users));
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
