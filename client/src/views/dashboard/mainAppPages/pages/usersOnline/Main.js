import React from "react";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Online from "./Online";
import { connect } from "react-redux";
import theme from "../../components/profile/theme";
import ThemeProvider from "@material-ui/styles/ThemeProvider"; 


function Main(props) {
  

  return (
 <ThemeProvider theme={theme}>
    <React.Fragment>
      <CssBaseline />
      <div mb="44px">
        <Typography
          component="h2"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
          style={{
            paddingTop: "30px"
          }}
        >
         Online Users
        </Typography>
        <Grid container justify="center">
        <Grid item xs={12} sm={8} md={6}>
        <Typography
          component="h4"
          variant="h5"
          align="center"
          color="primary"
          gutterBottom
          style={{
            // paddingTop: "30px"
          }}
        >
         for every person you follow, you gain: 20 points and an instant followback, also when you are followed, we automatically help u follow the person back
        </Typography>
       <Typography
          component="h5"
          variant="h5"
          align="center"
          color="textPrimary"
          gutterBottom
          style={{
            // paddingTop: "30px"
          }}
        >
          Note: Follows are limited to 20 per day
        </Typography>
        </Grid>
        </Grid>
      </div>
      <Grid
        container
        style={{
          maxWidth: window.innerWidth <= 320 && "265px",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        
      </Grid>
      { <Online />}
    </React.Fragment>
  </ThemeProvider>
  );
}


const mapStateToProps = state => ({
  auth: state.auth,
});
export default connect(
  mapStateToProps
)(Main);
