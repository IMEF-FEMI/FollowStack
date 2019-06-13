import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Fab from "@material-ui/core/Fab";
import NavigationIcon from "@material-ui/icons/Navigation";

export const NavToTopButton = props => {
  const { classes } = props;
  return (
    <Fab
      id="goTopButton"
      variant="extended"
      aria-label="go-top"
      className={classes.root}
      onClick={props.scrollToTop}
    >
      <NavigationIcon className={classes.navIcon} />
      Go to Top
    </Fab>
  );
};

const styles = theme => ({
  root: {
    margin: theme.spacing(),
    position: "fixed",
    bottom: "5%",
    right: "5%",
    zIndex: 5000
  },
  navIcon: {
    marginRight: theme.spacing()
  }
});

NavToTopButton.propTypes = {
  classes: PropTypes.object.isRequired,
  scrollToTop: PropTypes.func.isRequired
};

export default withStyles(styles)(NavToTopButton);
