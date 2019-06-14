import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import LayoutBody from "../components/LayoutBody";
import Typography from "../components/Typography";
import PermIdentity from "@material-ui/icons/PermIdentity";
import Favorite from "@material-ui/icons/Favorite";
import SvgIcon from "@material-ui/core/SvgIcon";

const styles = theme => ({
  root: {
    display: "flex",
    backgroundColor: "#0d1625",
    overflow: "hidden"
  },
  layoutBody: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(15),
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `0px ${theme.spacing(5)}px`
  },
  title: {
    marginBottom: theme.spacing(14),
    color: "#fff"
  },
  number: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightMedium
  },
  image: {
    height: 55,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  curvyLines: {
    pointerEvents: "none",
    position: "absolute",
    top: -180,
    opacity: 0.7
  },
  button: {
    marginTop: theme.spacing(8)
  }
});

function ProductHowItWorks(props) {
  const { classes } = props;
  

  return (
    <section className={classes.root}>
      <LayoutBody className={classes.layoutBody} width="large">
        <Typography
          variant="h4"
          marked="center"
          className={classes.title}
          component="h2"
          align="center"
        >
          Easy as A-B-C
        </Typography>
        <div>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>1.</div>
                <PermIdentity
                  style={{ color: "#908a16", width: "55px", height: "55px" }}
                />
                <Typography
                  variant="h5"
                  align="center"
                  style={{ color: "#fff" }}
                >
                  Register using your Twitter Account and go to the Gain
                  followers Section to Gain Followers
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>2.</div>

                <SvgIcon
                  style={{
                    color: "rgb(28, 136, 204)",
                    width: "55px",
                    height: "55px"
                  }}
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </SvgIcon>
                <Typography
                  variant="h5"
                  align="center"
                  style={{ color: "#fff" }}
                >
                  {`Go to View shared Tweets section to gain points. 
                you gain points by liking  / commenting / retweeting peoples Tweets.`}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>3.</div>
                <Favorite
                  style={{ color: "#ff3366", width: "55px", height: "55px" }}
                />
                <Typography
                  variant="h5"
                  align="center"
                  style={{ color: "#fff" }}
                >
                  {`To get likes/comments and RT's on your tweets go to the Profile Section
                and click on the share button sign on any of your tweets to add to FollowStack so that others can see. 
                This requires only 50 Points. If your points are not enough go back to the view shared tweets section to earn some points`}
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
