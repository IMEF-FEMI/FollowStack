import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import LayoutBody from "../components/LayoutBody";
import Typography from "../components/Typography";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(9),
    marginBottom: theme.spacing(9),
    backgroundColor: "#0d1625"
  },
  button: {
    border: "4px solid currentColor",
    borderRadius: 0,
    height: "auto",
    padding: `${theme.spacing(2)}px ${theme.spacing(5)}px`
  },
  link: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    color: "#fff"
  },
  buoy: {
    width: 60
  }
});

function ProductSmokingHero(props) {
  const { classes } = props;
  const linkProps = { target: "_blank", rel: "noreferrer" };

  return (
    <LayoutBody className={classes.root} component="section">
      <Typography variant="subtitle1" className={classes.link}>
        Check our Social media Pages
      </Typography>

      <Grid container justify="center">
        <Grid item>
          <a href="https://instagram.com/followstack_app" {...linkProps}>
            <i
              className="fab fa-facebook-f fa-2x"
              style={{
                color: "#fff",
                width: "55px",
                height: "55px"
              }}
            />
          </a>
          <a href="https://twitter.com/follow_stack" {...linkProps}>
            <i
              className="fab fa-twitter fa-2x"
              style={{
                color: "#1c88cc",
                width: "55px",
                height: "55px"
              }}
            />
          </a>
          <a href="https://instagram.com/followstack_app" {...linkProps}>
            <i
              className="fab fa-instagram fa-2x"
              style={{
                color: "#c78732",
                width: "55px",
                height: "55px"
              }}
            />
          </a>
        </Grid>
      </Grid>
    </LayoutBody>
  );
}

ProductSmokingHero.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductSmokingHero);
