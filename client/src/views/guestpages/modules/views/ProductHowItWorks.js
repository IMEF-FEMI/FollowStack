import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import LayoutBody from "../components/LayoutBody";
import Typography from "../components/Typography";

const styles = theme => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.secondary.light,
    overflow: "hidden"
  },
  layoutBody: {
    marginTop: theme.spacing.unit * 10,
    marginBottom: theme.spacing.unit * 15,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `0px ${theme.spacing.unit * 5}px`
  },
  title: {
    marginBottom: theme.spacing.unit * 14
  },
  number: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightMedium
  },
  image: {
    height: 55,
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  },
  curvyLines: {
    pointerEvents: "none",
    position: "absolute",
    top: -180,
    opacity: 0.7
  },
  button: {
    marginTop: theme.spacing.unit * 8
  }
});

function ProductHowItWorks(props) {
  const { classes } = props;
  const productCurvyLines = require("../../assets/img/productCurvyLines.png");
  const media = require("../../assets/img/media.svg");
  const identity = require("../../assets/img/identity.svg");
  const favorite = require("../../assets/img/favorite.svg");

  return (
    <section className={classes.root}>
      <LayoutBody className={classes.layoutBody} width="large">
        <img
          src={productCurvyLines}
          className={classes.curvyLines}
          alt="curvy lines"
        />
        <Typography
          variant="h4"
          marked="center"
          className={classes.title}
          component="h2"
        >
          Easy as A-B-C
        </Typography>
        <div>
          <Grid container spacing={40}>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>1.</div>
                <img src={identity} alt="user" className={classes.image} />
                <Typography variant="h5" align="center">
                  Register using your Twitter Account and go to the Gain
                  followers Section to Gain Followers
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>2.</div>
                <img src={media} alt="media" className={classes.image} />
                <Typography variant="h5" align="center">
                  {`Go to View Tweets section to gain points. 
                you gain points by liking  / commenting / retweeting peoples Tweets.`}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>3.</div>
                <img src={favorite} alt="clock" className={classes.image} />
                <Typography variant="h5" align="center">
                  {`To get likes/comments and RT's on your tweets go to the Profile Section
                and click the plus sign on any of your tweets to add to FollowStack so that others can see. 
                This requires only 10 Points. If your points are not enough go back to the view tweets section to earn some more`}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      </LayoutBody>
    </section>
  );
}

ProductHowItWorks.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductHowItWorks);
