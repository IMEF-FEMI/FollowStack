import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";

import PostCardLoader from "./PostCardLoader";

export const MainPageLoader = props => {
  const { classes } = props;
  return (
    <Grid
      justify="center"
      alignItems="center"
      wrap="wrap"
      className={classes.root}
      container
      spacing={4}
    >
      <Grid item xs={12} sm={8}>
        <PostCardLoader className={classes.gridItem} />
      </Grid>
      <Grid item xs={12} sm={8}>
        <PostCardLoader className={classes.gridItem} />
      </Grid>
      <Grid item xs={12} sm={8}>
        <PostCardLoader className={classes.gridItem} />
      </Grid>
    </Grid>
  );
};

const styles = theme => ({
  root: {
    // margin: "auto",
    paddingTop: "0px"
    // backgroundColor: "#2c3e50"
  }
});

MainPageLoader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainPageLoader);
