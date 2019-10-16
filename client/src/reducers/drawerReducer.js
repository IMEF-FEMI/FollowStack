import { OPEN_DRAWER, CLOSE_DRAWER } from "../actions/types";

const initialState = {
  isOpen: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case OPEN_DRAWER:
      return { ...state, isOpen: true };
    case CLOSE_DRAWER:
      return {
        ...state,
        isOpen: false
      };
    default:
      return state;
  }
}
