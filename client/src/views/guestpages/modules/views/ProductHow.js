import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import LayoutBody from "../components/LayoutBody";
import Typography from "../components/Typography";

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
    marginBottom: theme.spacing(14)
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
  }
});

function ProductHow(props) {
  const { classes } = props;

  return (
    <section className={classes.root}>
      <LayoutBody className={classes.layoutBody} width="large">
        <Typography
          variant="h4"
          marked="center"
          className={classes.title}
          component="h2"
          style={{ color: "#fff" }}
          align="center"
        >
          How you get followers!
        </Typography>
        <div>
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <div className={classes.item}>
                <Typography
                  variant="h5"
                  align="center"
                  style={{ color: "#fff" }}
                >
                  {`Getting followers on followstack is very simple. 
                  we use a method already familiar to you - The FOLLOW FOR FOLLOW Method. 
                  It entails following a number of accounts, waiting for them to follow Back 
                  and unfollowing those that didnt follow back after a specified time. This is one of the most
                  efficient ways of growing your account quickly and the followers you get are REAL and active. `}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      </LayoutBody>
    </section>
  );
}

ProductHow.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductHow);
