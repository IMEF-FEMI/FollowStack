import {
  SET_USERS_PAGE,
  SET_USERS,
  SET_USERS_INITIAL_FETCH,
  SET_USERS_IS_FETCHING,
  SET_USERS_HAS_MORE,
  REFRESH_ONLINE,
  UPDATE_USER,
  UPDATE_UNFOLLOW_USER
} from "../actions/types";

const initialState = {
  page: 0,
  users: [],
  initialFetch: true,
  isFetching: false,
  hasMore: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USERS_PAGE:
      return {
        ...state,
        page: action.payload
      };
    case SET_USERS:
      // combine the 2 lists and get unique users
      const users = [...state.users, ...action.payload];

      const unique = users
        .map(e => e["userid"])
        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the dead keys & store unique objects
        .filter(e => users[e])
        .map(e => users[e]);

      return {
        ...state,
        // users: [...state.users, ...action.payload]
        users: [...unique]
      };
    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user.userid === action.payload.userid
            ? // update the user with the id  and set following = true
              { ...user, following: true }
            : // otherwise return original todo
              user
        )
      };
    case UPDATE_UNFOLLOW_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user.userid === action.payload.userid
            ? // update the user with the id  and set following = true
              { ...user, following: false }
            : // otherwise return original todo
              user
        )
      };
    case SET_USERS_INITIAL_FETCH:
      return {
        ...state,
        initialFetch: action.payload
      };
    case SET_USERS_IS_FETCHING:
      return {
        ...state,
        isFetching: action.payload
      };
    case SET_USERS_HAS_MORE:
      return {
        ...state,
        hasMore: action.payload
      };

    case REFRESH_ONLINE:
      return { ...initialState };

    default:
      return state;
  }
}
