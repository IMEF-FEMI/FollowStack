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
import AddBox from "@material-ui/icons/AddBox";
import Close from "@material-ui/icons/Close";
import Launch from "@material-ui/icons/Launch";
import Tooltip from "@material-ui/core/Tooltip";
import { addTweetPost, removeTweetPost } from "../../../../../async/post";
import {setPoints} from '../../../../../actions/authActions'
import Tweet from "./Tweet/Tweet";
import toast from "toasted-notes";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";


class RenderTweets extends Component {
  
  addTweet = async tweet => {
    const { auth } = this.props;
    const res = await addTweetPost(auth.user._id, tweet);
    if (res.data.success) {
      tweet.added = true;
      toast.notify(res.data.success);
      this.props.setPoints(res.data.points)
    } else if (res.data.error) {
      tweet.added = false;
      toast.notify(res.data.error);
    }
  };

  removeTweet = async tweet => {
    const { auth } = this.props;
    const res = await removeTweetPost(tweet.id_str, auth.user._id);
    if (res.data.success) {
      tweet.added = false;
      toast.notify(res.data.success);
    } else if (res.data.error) {
      tweet.added = true;
      toast.notify(res.data.error);
    }
  };


  render() {
    const { classes } = this.props;
    const data = this.props.pages;
    const linkProps = { target: "_blank", rel: "noreferrer" };

    return (
      <Grid
        className={classes.gridContainer}
        classes={{ "spacing-xs-24": classes.spacingXs24 }}
        direction="row"
        wrap="wrap"
        justify={"center"}
        container
        spacing={24}
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
                // style={{
                //   maxWidth: window.innerWidth <= 599 && `${ 0.8 * window.innerWidth}`
                // }}
                xs={12}
                sm={10}
                md={8}
                lg={8}
                xl={8}
              >
                <Card className={classes.card}>
                  <CardHeader
                    style={{
                      backgroundColor: item.added === true && "#ca7c7c"
                    }}
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
                        {this.props.context === "profile" &&
                          (!item.added || item.added === false) && (
                            <Tooltip
                              title="Add to Tweet Feeds"
                              aria-label="Add"
                            >
                              <IconButton
                                onClick={async () => {
                                  await this.addTweet(item);
                                  this.forceUpdate();
                                }}
                              >
                                <AddBox color="primary" />
                              </IconButton>
                            </Tooltip>
                          )}
                        {this.props.context === "profile" &&
                          (item.added && item.added === true) && (
                            <Tooltip
                              title="Remove from Tweet Feeds"
                              aria-label="Remove"
                              onClick={async () => {
                                await this.removeTweet(item);
                                this.forceUpdate();
                              }}
                            >
                              <IconButton>
                                <Close color="secondary" />
                              </IconButton>
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
                    context={this.props.context}
                    // setPoints={this.props.setPoints}
                  />
                </Card>
              </Grid>
            );
          } else { 
            return null;
          }
        })}
        {this.props.isFetching && (
         <Grid
         item
         xs={12}>
         <CircularProgress style={{
            margin: "16px auto",
            display: "block"
          }}
          size={50} />
          </Grid>
          
        )}
        { <Fab
            color="primary"
            aria-label="Points"
            className={classes.fab}
          >
            <AddIcon />
          </Fab>}
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
  spacingXs24: {
    width: "100%",
    margin: 0
  },
  fab: {
    margin: theme.spacing.unit,
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
    padding: `${theme.spacing.unit}px`,
    marginBottom: `${theme.spacing.unit}px`
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
    marginTop: `${theme.spacing.unit * 2}px`
  },
  goBackBtn: {
    textTransform: "capitalize"
  },
  verticalSpace: {
    height: "100vh"
  }
});

RenderTweets.propTypes = {
  gainFollowers: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  setPoints: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth,
  gainFollowers: state.gainFollowers
});
export default connect(mapStateToProps,{setPoints})(withStyles(styles)(RenderTweets));
