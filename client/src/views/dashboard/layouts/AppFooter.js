import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import { Link } from "react-router-dom";
import React, { Component } from "react";

class AppFooter extends Component {
  render() {
    const { classes } = this.props;
    const currentYear = new Date().getFullYear();
    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={16}
          className={classNames(classes.footerText, classes.footerSections)}
        >
          <Grid item xs={12} sm={4}>
            <ul style={{ listStyle: "none", margin: 0 }}>
              <Link
                style={{
                  textDecoration: "none",
                  color: "black"
                }}
                to="/"
              >
                Home
              </Link>
            </ul>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ul style={{ listStyle: "none", margin: 0 }}>
              <Link
                to="/about"
                style={{
                  textDecoration: "none",
                  color: "black"
                }}
              >
                About
              </Link>
            </ul>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ul style={{ listStyle: "none", margin: 0 }}>
              <Link
                style={{
                  textDecoration: "none",
                  color: "black"
                }}
                to="/terms"
              >
                Terms
              </Link>
            </ul>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ul style={{ listStyle: "none", margin: 0 }}>
              <Link
                style={{
                  textDecoration: "none",
                  color: "black"
                }}
                to="/privacy"
              >
                Privacy
              </Link>
            </ul>
          </Grid>
        </Grid>
        <Grid className={classes.subFooter} item xs={12} sm={4} align="center">
          <Typography
            variant="overline"
            gutterBottom
            style={{
              color: "black"
            }}
            component={"span"}
          >
            © {currentYear} FollowStack
          </Typography>
        </Grid>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    marginTop: 30,
    backgroundColor: `#fff`,
    paddingTop: "16px",
    overflowX: "hidden"
  },
  footerSections: {
    margin: "0 4px"
  },
  subFooter: {
    padding: "8px 16px 8px 16px",
    marginTop: "8px"
  },
  footerText: {
    color: "#fff",
    fontSize: "18px",
    lineHeight: 1.5
  },
  white: {
    color: "#ffffff"
  }
});

export default withStyles(styles)(AppFooter);
