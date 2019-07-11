import React from "react";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Online from "./Online";
import { connect } from "react-redux";


function Main(props) {
  

  return (
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
  );
}


const mapStateToProps = state => ({
  auth: state.auth,
});
export default connect(
  mapStateToProps
)(Main);
