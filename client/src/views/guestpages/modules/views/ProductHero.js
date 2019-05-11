import React from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Button from "../components/Button";
import Typography from "../components/Typography";
import ProductHeroLayout from "./ProductHeroLayout";

const backgroundImage = require("../../assets/img/socialmedia.jpg");

const styles = theme => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: "grey", // Average color of the background image.
    backgroundPosition: "center"
  },
  button: {
    minWidth: 200,

    color: "inherit",
    position: "relative",
    padding: "0.9375rem",
    fontWeight: "400",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
    "&:hover,&:focus": {
      color: "inherit",
      background: "rgba(200, 200, 200, 0.2)"
    },
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 30px)",
      marginLeft: "15px",
      marginBottom: "8px",
      marginTop: "8px",
      textAlign: "left",
      "& > span:first-child": {
        justifyContent: "flex-start"
      }
    }
  },
  h5: {
    marginBottom: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 4,
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing.unit * 10
    }
  },
  more: {
    marginTop: theme.spacing.unit * 2
  }
});
const button = {
  minWidth: 200,

  color: "inherit",
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
    color: "inherit",
    background: "rgba(200, 200, 200, 0.2)"
  }
};
function ProductHero(props) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img style={{ display: "none" }} src={backgroundImage} alt="" />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        Gain More Followers With FollowStack
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        className={classes.h5}
      >
        FollowStack Not only Help you increase your followers, it also help you
        <br />
        gain more likes and comments on your posts making you a Star
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        size="large"
        component={linkProps => (
          <Link
            {...linkProps}
            component={RouterLink}
            to="/sign-up"
            variant="button"
            style={button}
          />
        )}
      >
        Register
      </Button>
    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductHero);
