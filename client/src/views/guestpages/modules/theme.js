import { createMuiTheme } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import grey from "@material-ui/core/colors/grey";
import red from "@material-ui/core/colors/red";

const rawTheme = createMuiTheme({
  palette: {
    primary: {
      ligth: "#69696a",
      main: "#28282a",
      dark: "#1e1e1f"
    },
    secondary: {
      light: "#fff5f8",
      main: "#ff3366",
      dark: "#e62958"
    },
    warning: {
      main: "#ffc071",
      dark: "#ffb25e"
    },
    error: {
      xLight: red[50],
      main: red[500],
      dark: red[700]
    },
    success: {
      xLight: green[50],
      dark: green[700]
    }
  },
  
});



const theme = {
  ...rawTheme,
  palette: {
    ...rawTheme.palette,
    background: {
      ...rawTheme.palette.background,
      default: rawTheme.palette.common.white,
      placeholder: grey[200]
    }
  },
  
};

export default theme;
