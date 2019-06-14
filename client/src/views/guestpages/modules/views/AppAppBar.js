import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import compose from "recompose/compose";
import classNames from "classnames";
import PropTypes from "prop-types";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

class AppBar extends React.Component {
  renderNavButtons() {
    const { classes } = this.props;
    const location = this.props.location.pathname;
    const MyLink = React.forwardRef((props, ref) => (
      <Link innerRef={ref} {...props} />
    ));

    return (
      <div className={classes.nav}>
        <Button
          to="/sign-in"
          component={MyLink}
          variant="text"
          color={location !== "/" ? "default" : "inherit"}
          className={classes.button}
        >
          &nbsp;Sign In
        </Button>
        <Button
          to="/sign-up"
          component={MyLink}
          variant="contained"
          color="secondary"
          // style={{
          //   color: "#ff3366"
          // }}
          className={classes.button}
        >
          &nbsp;Sign Up
        </Button>
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    const location = this.props.location.pathname;
    const MyLink = React.forwardRef((props, ref) => (
      <Link innerRef={ref} {...props} />
    ));

    return (
      <div className={classes.root}>
        <MuiAppBar
          className={classes.heroStylesAppBar}
          style={{
            backgroundColor: location !== "/" ? "#fff" : "transparent"
          }}
          position="fixed"
        >
          <Toolbar style={{ paddingRight: "10px" }}>
            <div>
              <MyLink
                to="/"
                style={{
                  textDecoration: "none",
                  color: location !== "/" ? "black" : "#fff"
                }}
                className={classNames(classes.logo, classes.aTag)}
              >
                
                <img
                  alt="FollowStack logo"
                  className={classes.logoImage}
                  src={location !== "/" ?"/images/logos/followstack.png":"/images/logos/followstack_white.png"}
                />
              </MyLink>
            </div>

            {this.renderNavButtons()}
          </Toolbar>
        </MuiAppBar>
      </div>
    );
  }
}

AppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  heroStylesAppBar: {
    boxShadow: "none",
    position: "absolute",
    zIndex: "1000",
    width: "100%"
  },
  grow: {
    flexGrow: 1
  },
  logo: {
    display: "flex"
  },
  logoImage: {
    cursor: "pointer",
    height: "55px"
  },
  nav: {
    display: "flex",
    marginLeft: "auto",
    alignItems: "center"
  },
  aTag: {
    padding: 0,
    color: "inherit",
    textDecoration: "none"
  },
  button: {
    position: "relative",
    textTransform: "uppercase",
    textDecoration: "none",
    display: "inline-flex",
    "&:hover,&:focus": {
      color: "white",
      background: "rgba(0,0,0,.125)"
    }
  }
});

export default compose(
  withRouter,
  withStyles(styles)
)(AppBar);
