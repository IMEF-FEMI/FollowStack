import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";


const LaunchScreen = ({ classes }) => (
  <div
    className={classes.root}
    style={{
      backgroundColor: "#2c3e50",
      backgroundImage: ""
    }}
  >
    <LinearProgress color="secondary" />
    <Grid item xs={12}>
    <Typography
        className={classes.brandTextLogo}
        align="center"
        variant="h2"
        color="inherit"
      >
        <i
        className="fas fa-hashtag"
        style={{
          color: "#fff"
        }}
      />
      </Typography>
       <Typography
        className={classes.brandText}
        align="center"
        variant="h2"
        color="inherit"
      >
        FollowStack
      </Typography>
      <Typography
        className={classes.brandTextSub}
        align="center"
        variant="h4"
        color="inherit"
      >
        Lets Grow Together
      </Typography>
    </Grid>
  </div>
);

LaunchScreen.propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  root: {
    // background: `linear-gradient(to right bottom, ${
    //   theme.palette.primary.light
    // } 0%, ${theme.palette.primary.main} 33% , ${
    //   theme.palette.primary.dark
    // } 67%)`,
    height: "100vh",
    position: "relative",
    width: "100%"
  },
   brandTextLogo: {
    position: "absolute",
    top: "35%",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#fff",
    [theme.breakpoints.up("xl")]: {
      top: "70%"
    }
  },

  brandText: {
    position: "absolute",
    top: "47%",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#fff",
    [theme.breakpoints.up("xl")]: {
      top: "70%"
    }
  },
   brandTextSub: {
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#fff",
    [theme.breakpoints.up("xl")]: {
      top: "70%"
    }
  },
  linearProgress: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0
  }
});

export default withStyles(styles)(LaunchScreen);
