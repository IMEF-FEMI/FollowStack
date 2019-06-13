import React from "react";
import {Link as RouterLink} from 'react-router-dom'
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import LayoutBody from "../components/LayoutBody";
import Button from "../components/Button";
import Typography from "../components/Typography";

const styles = theme => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.secondary.light,
    overflow: "hidden"
  },
  layoutBody: {
    marginTop: theme.spacing(10) ,
    marginBottom: theme.spacing(15) ,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `0px ${theme.spacing(5) }px`
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
    marginTop: theme.spacing(4) ,
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
const button = {
  minWidth: 200,

  color: "white",
  position: "relative",
  // padding: "0.9375rem",
  // fontWeight: "400",
  // fontSize: "12px",
  textTransform: "uppercase",
  // borderRadius: "3px",
  // lineHeight: "20px",
  textDecoration: "none",
  // margin: "0px",
  display: "inline-flex",
  "&:hover,&:focus": {
    color: "white",
    background: "rgba(200, 200, 200, 0.2)"
  }
};

function ProductHow(props) {
  const { classes } = props;
  const productCurvyLines = require("../../assets/img/productCurvyLines.png");

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
          How you get followers!
        </Typography>
        <div>
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <div className={classes.item}>
                <Typography variant="h5" align="center">
                  {`Getting followers on followstack is very simple. 
                  we use a method already familiar to you - the follow back Method. 
                  It entails following a number of accounts, waiting for them to follow Back 
                  and unfollowing ONLY those that didnt follow back after a specified time. 
                  And all these are done with just a push of a button... Nice eh!`}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
        <Button
          color="secondary"
          size="large"
          variant="contained"
          className={classes.button}
          component={linkProps => (
            <Link
            component={RouterLink}
              {...linkProps}
              to="/sign-up"
              variant="button"
              style={button}
            />
          )}
        >
          Get started
        </Button>
      </LayoutBody>
    </section>
  );
}

ProductHow.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductHow);
