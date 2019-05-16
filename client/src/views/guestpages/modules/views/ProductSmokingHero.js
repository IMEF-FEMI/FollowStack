import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import LayoutBody from "../components/LayoutBody";
import Typography from "../components/Typography";
import Grid from "@material-ui/core/Grid";


const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing.unit * 9,
    marginBottom: theme.spacing.unit * 9
  },
  button: {
    border: "4px solid currentColor",
    borderRadius: 0,
    height: "auto",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 5}px`
  },
  link: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  },
  buoy: {
    width: 60
  }
});

function ProductSmokingHero(props) {
  const { classes } = props;
  const productBuoy = require("../../assets/img/productBuoy.svg");

  const facebook = require("../../assets/img/facebook1.png");
  const twitter = require("../../assets/img/twitter1.png");
  const instagram = require("../../assets/img/instagram1.png");

  return (
    <LayoutBody className={classes.root} component="section">
      <Button className={classes.button}>
        <Typography variant="h4" component="span">
          Got any questions? Need help?
        </Typography>
      </Button>
      <Typography variant="subtitle1" className={classes.link}>
        We are here to help. Get in touch!
      </Typography>
      <img src={productBuoy} className={classes.buoy} alt="buoy" />
      <Typography variant="subtitle1" className={classes.link}>
        Check our Social media Pages
      </Typography>
      
        <Grid container>
          <Grid item xs={12} sm={4}>
            <a href="https://facebook.com/followstackapp">
              <img src={facebook} alt="Facebook" />
            </a>
            </Grid>
            <Grid item xs={12} sm={4}>
            <a href="https://twitter.com/followstackapp">
              <img src={twitter} alt="Twitter" />
            </a>
            </Grid>
            <Grid item xs={12} sm={4}>
            <a href="https://instagram/followstackapp">
              <img src={instagram} alt="Instagram" />
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
