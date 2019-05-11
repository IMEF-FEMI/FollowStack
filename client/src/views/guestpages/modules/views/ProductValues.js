import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import LayoutBody from "../components/LayoutBody";
import Typography from "../components/Typography";

const styles = theme => ({
  root: {
    display: "flex",
    overflow: "hidden",
    backgroundColor: theme.palette.secondary.light
  },
  layoutBody: {
    marginTop: theme.spacing.unit * 15,
    marginBottom: theme.spacing.unit * 30,
    display: "flex",
    position: "relative"
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `0px ${theme.spacing.unit * 5}px`
  },
  image: {
    height: 55
  },
  title: {
    marginTop: theme.spacing.unit * 5,
    marginBottom: theme.spacing.unit * 5
  },
  curvyLines: {
    pointerEvents: "none",
    position: "absolute",
    top: -180
  }
});

function ProductValues(props) {
  const { classes } = props;
  const money = require("../../assets/img/attach_money_48px.svg");
  const face = require("../../assets/img/face_48px.svg");
  const verified = require("../../assets/img/verified_user_48px.svg");
  const productCurvyLines = require("../../assets/img/productCurvyLines.png");
  return (
    <section className={classes.root}>
      <LayoutBody className={classes.layoutBody} width="large">
        <img
          src={productCurvyLines}
          className={classes.curvyLines}
          alt="curvy lines"
        />
        <Grid container spacing={40}>
          <Grid item xs={12} md={12}>
            <Typography
              variant="h4"
              marked="center"
              align="center"
              component="h2"
            >
              Why Grow Your Account
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <img className={classes.image} src={money} alt="Money" />
              <Typography variant="h6" className={`${classes.title} `}>
                You could earn lots of money
              </Typography>
              <Typography variant="h5">
                {`You could make a lot of money off your social media
                  account by using Platforms like `}
                {<a href="https://famebit.com">FameBit</a>}
                {` or by posting adverts for individuals looking 
                  for ways to make their product and services known`}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <img className={classes.image} src={face} alt="graph" />
              <Typography variant="h6" className={`${classes.title} `}>
                More clients for your business
              </Typography>
              <Typography
                variant="h5"
                //  className="text-center"
              >
                {`Getting a massive following will make both you 
                  and your business popular. And anyone visiting your account 
                  will be operating on the assumption that whatever product or 
                  service you are selling is already popular (because of your many followers) 
                  and will be more willing to try it out`}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <img className={classes.image} src={verified} alt="clock" />
              <Typography variant="h6" className={`${classes.title} `}>
                You'll get even more followers
              </Typography>
              <Typography variant="h5">
                {`Having a massive Instagram following will 
                naturally attract more users to your profile. People will become curious 
                about you, and they will want to become a part of your 
                following. From this, you could end becoming a celebrity 
                and possibly have massive financial success while at it!`}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </LayoutBody>
    </section>
  );
}

ProductValues.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductValues);
