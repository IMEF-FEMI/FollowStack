import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import LayoutBody from "../components/LayoutBody";
import Typography from "../components/Typography";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Face from "@material-ui/icons/Face";
import AttachMoney from "@material-ui/icons/AttachMoney";

const styles = theme => ({
  root: {
    display: "flex",
    overflow: "hidden",
    backgroundColor: "#0d1625"
  },
  layoutBody: {
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(30),
    display: "flex",
    position: "relative"
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `0px ${theme.spacing(5)}px`
  },
  image: {
    height: 55
  },
  title: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    color: "#fff"
  },
  curvyLines: {
    pointerEvents: "none",
    position: "absolute",
    top: -180
  }
});

function ProductValues(props) {
  const { classes } = props;
  return (
    <section className={classes.root}>
      <LayoutBody className={classes.layoutBody} width="large">
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Typography
              variant="h4"
              marked="center"
              align="center"
              component="h2"
              style={{ color: "#fff" }}
            >
              Why Gain More Followers?
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <AttachMoney
                style={{ color: "#908a16", width: "55px", height: "55px" }}
              />
              <Typography variant="h6" align="center" className={classes.title}>
                You could earn lots of money
              </Typography>
              <Typography variant="h5" align="center" style={{ color: "#fff" }}>
                {`You could make a lot of money when you have much followers on your social media
                  account by using Platforms like `}
                {
                  <a
                    href="https://famebit.com"
                    style={{ textDecoration: "none" }}
                  >
                    FameBit
                  </a>
                }
                {` or by posting ads for Individuals looking 
                  for ways to make their product and services known`}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <Face
                style={{
                  color: "rgb(28, 136, 204)",
                  width: "55px",
                  height: "55px"
                }}
              />
              <Typography align="center" variant="h6" className={classes.title}>
                More clients for your business
              </Typography>
              <Typography align="center" variant="h5" style={{ color: "#fff" }}>
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
              <VerifiedUser
                style={{
                  color: "rgb(23,191, 99)",
                  width: "55px",
                  height: "55px"
                }}
              />
              <Typography
                align="center"
                variant="h6"
                className={classes.title}
                style={{ color: "#fff" }}
              >
                You'll get even more followers
              </Typography>
              <Typography align="center" variant="h5" style={{ color: "#fff" }}>
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
