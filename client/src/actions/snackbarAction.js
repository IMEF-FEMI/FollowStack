import {
  SNACKBAR_OPEN,
  SNACKBAR_MESSAGE,
  SNACKBAR_VARIANT,
  SNACKBAR_VERTICAL,
  SNACKBAR_HORIZONTAL
} from "./types";

export const onSnackbarOpen = () => async dispatch => {
  dispatch({
    type: SNACKBAR_OPEN,
    payload: true
  });
};
export const onSnackbarClose = () => async dispatch => {
  dispatch({
    type: SNACKBAR_OPEN,
    payload: false
  });
};

export const setSnackbarMessage = message => async dispatch => {
  dispatch({
    type: SNACKBAR_MESSAGE,
    payload: message
  });
};
export const setSnackbarVariant = variant => async dispatch => {
  dispatch({
    type: SNACKBAR_VARIANT,
    payload: variant
  });
};
export const setSnackbarVertical = vertical => async dispatch => {
  dispatch({
    type: SNACKBAR_VERTICAL,
    payload: vertical
  });
};
export const setSnackbarHorizontal = horizontal => async dispatch => {
  dispatch({
    type: SNACKBAR_HORIZONTAL,
    payload: horizontal
  });
};
