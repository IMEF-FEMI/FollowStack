import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Share from "@material-ui/icons/Share";
import Close from "@material-ui/icons/Close";
import Launch from "@material-ui/icons/Launch";
import Tooltip from "@material-ui/core/Tooltip";
import { addTweetPost, removeTweetPost } from "../../../../../async/post";
import { setPoints } from "../../../../../actions/authActions";
import Tweet from "./Tweet/Tweet";

import {
  enqueueSnackbar,
  closeSnackbar
} from "../../../../../actions/notistackActions";

class RenderProfileTweets extends Component {
  addTweet = async tweet => {
    const { auth } = this.props;
    tweet.added = true;
    this.forceUpdate();
    const res = await addTweetPost(auth.user._id, tweet);
    this.props.setPoints(res.data.points);
    this.notify(res, tweet);
  };

  notify = (res, tweet) => {
    // just istart replacing with redux actons here no questions lol..
    if (res.data.success) {

      this.props.enqueueSnackbar({
            message: res.data.success,
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                 action: key => (
                    <Button style={{color: "#fff"}} onClick={() => this.props.closeSnackbar(key)}>dismiss</Button>
                ),
            },
        });
    } else if (res.data.error) {
      tweet.added = false;
      this.forceUpdate();
      // using material ui custom snackbar instead of a third party library

      
      this.props.enqueueSnackbar({
            message: res.data.error,
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'error',
                 action: key => (
                    <Button style={{color: "#fff"}} onClick={() => this.props.closeSnackbar(key)}>dismiss</Button>
                ),
            },
        });

      // redirect to  get-points
      this.props.history.push("/earn-points");
    }
  };
  removeTweet = async tweet => {
    const { auth } = this.props;
    tweet.added = false;
    this.forceUpdate();
    const res = await removeTweetPost(tweet.id_str, auth.user._id);
    this.notify(res, tweet);
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
                style={{ padding: "0px" }}
                xs={12}
                sm={10}
                md={8}
                lg={8}
                xl={8}
              >
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <div>
                        {(!item.added || item.added === false) && (
                          <Tooltip title="Share Tweet" aria-label="Share">
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
                  />
                  <Tweet
                    data={item}
                    linkProps={linkProps}
                    context={"profile"}
                  />
                  <Divider />
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
    paddingRight: "48px"
    // zIndex: 1000
  },
  gridContainer: {
    minHeight: "100vh"
  },
  // spacingXs24: {
  //   width: "100%",
  //   margin: 0
  // },
  card: {
    borderRadius: "0px",
    boxShadow: "none"
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

export default compose(
  connect(
    mapStateToProps,
    { setPoints, enqueueSnackbar, closeSnackbar }
  ),
  withStyles(styles),
  withRouter
)(RenderProfileTweets);
