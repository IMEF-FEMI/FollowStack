import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Share from "@material-ui/icons/Share";
import Close from "@material-ui/icons/Close";
import Launch from "@material-ui/icons/Launch";
import Tooltip from "@material-ui/core/Tooltip";
import { addTweetPost, removeTweetPost } from "../../../../../async/post";
import { setPoints } from "../../../../../actions/authActions";
import { addNotificationAction } from "../../../../../actions/notificationAction";
import Tweet from "./Tweet/Tweet";
import {
  onSnackbarOpen,
  setSnackbarMessage,
  setSnackbarVariant,
} from "../../../../../actions/snackbarAction";


class RenderProfileTweets extends Component {
  
  addTweet = async tweet => {
    const { auth } = this.props;
    tweet.added = true;
    this.forceUpdate();
    const res = await addTweetPost(auth.user._id, tweet);
    this.props.setPoints(res.data.points);
    this.notify(res, "sharedTweet", tweet);
  };

  notify = (res, notificationType, tweet) => {
    // just istart replacing with redux actons here no questions lol..
    if (res.data.success) {
     
      this.props.setSnackbarMessage(res.data.success)
      this.props.setSnackbarVariant("success")
      this.props.onSnackbarOpen()
      this.props.addNotificationAction({
        id: Date.now(),
        title: res.data.success,
        when: Date.now(),
        type: notificationType,
        to: "#"
      });
    } else if (res.data.error) {
      tweet.added = false;
      this.forceUpdate();
      // using material ui custom snackbar instead of a third party library
     
      this.props.setSnackbarMessage(res.data.error)
      this.props.setSnackbarVariant("error")
      this.props.onSnackbarOpen()
      this.props.addNotificationAction({
        id: Date.now(),
        title: res.data.error,
        when: Date.now(),
        type: "error",
        to: "#"
      });
    }
  };
  removeTweet = async tweet => {
    const { auth } = this.props;
    tweet.added = false;
    this.forceUpdate();
    const res = await removeTweetPost(tweet.id_str, auth.user._id);
    this.notify(res, "unsharedTweet", tweet);
  };

  render() {
    const { classes } = this.props;
    const data = this.props.pages;
    const linkProps = { target: "_blank", rel: "noreferrer" };
    const { myProfile } = this.props;

    return (
      <Grid
        className={classes.gridContainer}
        // classes={{ "spacing-xs-24": classes.spacingXs24 }}
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
            item.in_reply_to_user_id_str === null
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
                  <CardHeader
                    // style={{
                    //   backgroundColor:
                    //     item.added && item.added === true && "#ca7c7c"
                    // }}
                    avatar={
                      <Avatar aria-label="avatar" className={classes.avatar}>
                        <img
                          src={`${item.user.profile_image_url}`}
                          alt={"user avatar"}
                        />
                      </Avatar>
                    }
                    action={
                      <div>
                        {(!item.added || item.added === false) && (
                          <Tooltip
                            title="Blow up this twe"
                            aria-label="Share"
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={async () => {
                                await this.addTweet(item);
                              }}
                            >
                              <Share color="primary" /> Share
                            </Button>
                          </Tooltip>
                        )}
                        {item.added && item.added === true && (
                          <Tooltip
                            title="Unshare"
                            aria-label="UnShare"
                            onClick={async () => {
                              await this.removeTweet(item);
                            }}
                          >
                            <Button size="small" variant="outlined">
                              <Close color="secondary" />
                              Remove
                            </Button>
                          </Tooltip>
                        )}
                        <a
                          href={`http://twitter.com/${
                            item.user.screen_name
                          }/status/${item.id_str}`}
                          {...linkProps}
                        >
                          <Tooltip title="open in new tab" aria-label="Open">
                            <IconButton>
                              <Launch />
                            </IconButton>
                          </Tooltip>
                        </a>
                      </div>
                    }
                    title={`${item.user.name}`}
                    subheader={`@${item.user.screen_name}`}
                  />
                  <Tweet
                    data={item}
                    linkProps={linkProps}
                    context={"profile"}
                  />
                </Card>
              </Grid>
            );
          } else {
            return null;
          }
        })}
        {myProfile.isFetching && (
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
  gridContainer: {
    minHeight: "100vh"
  },
  // spacingXs24: {
  //   width: "100%",
  //   margin: 0
  // },
  card: {
    borderRadius: "0px"
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
    marginTop: `${theme.spacing(2)}px`
  },
  goBackBtn: {
    textTransform: "capitalize"
  },
  verticalSpace: {
    height: "100vh"
  }
});

RenderProfileTweets.propTypes = {
  classes: PropTypes.object.isRequired,
  setPoints: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  myProfile: state.myProfile
});
export default connect(
  mapStateToProps,
  { setPoints, addNotificationAction,onSnackbarOpen ,
    setSnackbarMessage,
    setSnackbarVariant, }
)(withStyles(styles)(RenderProfileTweets));
