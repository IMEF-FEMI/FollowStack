import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import Tweet from "./Tweet/Tweet";

class RenderTweetsMain extends Component {
  render() {
    const { classes, viewTweets } = this.props;
    const data = this.props.pages;
    const linkProps = { target: "_blank", rel: "noreferrer" };

    return (
      <Grid
        className={classes.gridContainer}
        direction="row"
        wrap="wrap"
        justify={"center"}
        container
      >
        {data.map(item => {
          if (
            item.in_reply_to_screen_name === null &&
            item.in_reply_to_status_id === null &&
            item.in_reply_to_status_id_str === null &&
            item.in_reply_to_user_id === null &&
            item.in_reply_to_user_id_str === null&&
            item.user
          ) {
            return (
              <Grid
                item
                key={item.id_str}
                classes={{
                  item: classes.item
                }}
                style={{padding: "0px"}}
                
                xs={12}
                sm={10}
                md={8}
                lg={8}
                xl={8}
              >
                <Card className={classes.card}>
                  <Tweet data={item} linkProps={linkProps} context="Main" />
                    <Divider/>
                </Card>
              </Grid>
            );
          } else {
            return null;
          }
        })}
        {viewTweets.tweetIsFetching && (
          <Grid item xs={12}>
            <CircularProgress
              style={{
                margin: "16px auto",
                display: "block"
              }}
              size={50}
            />
          </Grid>
        )}
      </Grid>
    );
  }
}
const styles = theme => ({
  menuContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // add with of icon button as padding to center search
    paddingRight: "48px",
    zIndex: 1000
  },
  card: {
    borderRadius: "0px",
      boxShadow: "none"
  },
  gridContainer: {
    minHeight: "100vh"
  },
  fab: {
    margin: theme.spacing(),
    position: "fixed",
    bottom: "5%",
    left: "45%",
    zIndex: 5000
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  profileHeaderRoot: {
    padding: `${theme.spacing()}px`,
    marginBottom: `${theme.spacing()}px`
  },
  profileHeaderAvatarContainer: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  },
  profileHeaderUserText: {
    margin: 0
  },
  aTag: {
    color: "inherit",
    textDecoration: "none"
  },

  noResults: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  noResultsText: {
    marginTop: `${theme.spacing( 2) }px`
  },
  goBackBtn: {
    textTransform: "capitalize"
  },
  verticalSpace: {
    height: "100vh"
  }
});

RenderTweetsMain.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  viewTweets: state.viewTweets
});
export default connect(mapStateToProps)(withStyles(styles)(RenderTweetsMain));
