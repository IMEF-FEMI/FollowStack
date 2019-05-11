import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
// import Button from "@material-ui/core/Button";
import AppBar from "../components/AppBar";
import Toolbar, { styles as toolbarStyles } from "../components/Toolbar";

const styles = theme => ({
  title: {
    fontSize: 24
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: "space-between"
  },
  left: {
    flex: 1
  },
  leftLinkActive: {
    color: theme.palette.common.white
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end"
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
    marginLeft: theme.spacing.unit * 3
  },
  linkSecondary: {
    color: theme.palette.secondary.main
  },
  button: {
    margin: theme.spacing.unit
  }
});

function AppAppBar(props) {
  const { classes } = props;

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          <Link
            component={RouterLink}
            variant="h6"
            underline="none"
            color="inherit"
            className={classes.title}
            to="/"
          >
            {"onepirate"}
          </Link>
          <div className={classes.right}>
            <Link
              component={RouterLink}
              color="inherit"
              variant="h6"
              underline="none"
              className={`${
                classes.rightLink
              } btn btn-outline-danger btn-sm mr-2`}
              to="/sign-in"
              // className="btn btn-outline-danger btn-sm mr-2"
              style={{ width: 100 }}
            >
              {"Sign In"}
            </Link>
            <Link
              component={RouterLink}
              variant="h6"
              underline="none"
              className={`${classNames(
                classes.rightLink
              )} btn btn-danger btn-sm`}
              style={{ width: 100 }}
              to="/sign-up"
            >
              {"Sign Up"}
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.placeholder} />
    </div>
  );
}

AppAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AppAppBar);
