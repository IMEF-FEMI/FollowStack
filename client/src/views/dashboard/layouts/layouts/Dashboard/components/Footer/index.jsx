import React, { Component } from "react";

// Externals
import PropTypes from "prop-types";
import classNames from "classnames";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import { Typography } from "@material-ui/core";

// Component styles
const styles = theme => ({
  root: {
    paddingRight: theme.spacing() * 4,
    paddingBottom: theme.spacing() * 4,
    paddingLeft: theme.spacing() * 4
  },
  company: {
    marginTop: theme.spacing() * 2,
    marginBottom: theme.spacing() * 0.5
  }
});

class Footer extends Component {
  render() {
    const { classes, className } = this.props;

    const rootClassName = classNames(classes.root, className);
    const currentYear = new Date().getFullYear();
    return (
      <div className={rootClassName}>
        <Typography className={classes.company} variant="body1">
          &copy; FollowStack. {currentYear}
        </Typography>
      </div>
    );
  }
}

Footer.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Footer);
