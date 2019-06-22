import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
import compose from "recompose/compose";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { Typography, Divider } from "@material-ui/core";
import Online from "./Online";

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    },
    ul: {
      margin: 0,
      padding: 0
    },
    li: {
      listStyle: "none"
    }
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  content: {
    padding: theme.spacing(8, 0, 6)
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200]
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2)
  },
  logoDivider: {
    marginBottom: theme.spacing(2)
  }
});
class Main extends Component {
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="md" component="main" className={classes.content}>
          <Typography
            component="h2"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Earn Points
          </Typography>

          <Divider className={classes.logoDivider} />
          <Typography variant="h5" component="h2" gutterBottom align="center">
            You can earn points by following users currently online. For each
            follow, you earn 40 points, and the user will be notified to follow
            you back
          </Typography>
        </Container>
        <Online />
      </React.Fragment>
    );
  }
}
export default compose(withStyles(styles))(Main);
