import {
  SNACKBAR_OPEN,
  SNACKBAR_MESSAGE,
  SNACKBAR_VARIANT,
  SNACKBAR_VERTICAL,
  SNACKBAR_HORIZONTAL
} from "../actions/types";

const initialState = {
  snackbarOpen: false,
  snackbarMessage: "",
  snackbarVariant: "success",
  vertical: "top",
  horizontal: "right"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SNACKBAR_OPEN:
      return {
        ...state,
        snackbarOpen: action.payload
      };

    case SNACKBAR_MESSAGE:
      return {
        ...state,
        snackbarMessage: action.payload
      };
    case SNACKBAR_VARIANT:
      return {
        ...state,
        snackbarVariant: action.payload
      };
    case SNACKBAR_VERTICAL:
      return {
        ...state,
        vertical: action.payload
      };
    case SNACKBAR_HORIZONTAL:
      return {
        ...state,
        horizontal: action.payload
      };
    default:
      return state;
  }
}
