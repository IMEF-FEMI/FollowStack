import React from "react";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

const withTheme = theme => Component => props => (
  <MuiThemeProvider theme={theme}>
    <Component {...props} />
  </MuiThemeProvider>
);

export default withTheme;
