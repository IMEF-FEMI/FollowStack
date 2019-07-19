import React from "react";
import PropTypes from "prop-types";
import styles from "./styles";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Input from "@material-ui/core/Input";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Send from "@material-ui/icons/Send";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";

import { connect } from "react-redux";
import {
  postComment,
  postLike,
  unPostLike,
  postRetweet,
  unPostRetweet
} from "../../../../../../async/post";
import { setPoints } from "../../../../../../actions/authActions";

import {
  enqueueSnackbar,
  closeSnackbar
} from "../../../../../../actions/notistackActions";

class Footer extends React.Component {
  state = {
    expanded: false,
    favoriteColor: this.props.data.favorited ? "#ff3366" : "#657786",
    RtColor: this.props.data.retweeted ? "#17bf63" : "#657786",
    comment: ""
  };

  onValueChanged = e => {
    this.setState({ comment: e.target.value }, () => {});
  };
  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };
  handleKeyDown = e => {
    if (e.key === "Enter") {
      this.submitComment();
    }
  };

  submitComment = async () => {
    const tweet = this.props.data;
    this.handleExpandClick();

    const res = await postComment(
      this.props.auth.userData,
      this.state.comment,
      tweet,
      this.props.auth.keyInUse
    );
    if (res.data.success || res.data.error) {
      this.notify(res);
    }

    this.setState({ comment: "" });
  };

  favPost = async () => {
    const { userData, keyInUse } = this.props.auth;
    const tweet = this.props.data;
    let res = null;
    if (!tweet.favorited) {
      tweet.favorited = true;
      tweet.favorite_count += 1;
      this.setState({ favoriteColor: "#ff3366" });
      // this.forceUpdate();
      // post fav only if only tweet wasnt favorited
      res = await postLike(userData, tweet, keyInUse);
      if (res.data.success || res.data.error) {
        this.notify(res);
      }
    } else {
      tweet.favorited = false;
      tweet.favorite_count -= 1;
      this.setState({ favoriteColor: "#657786" });
      // this.forceUpdate();
      res = await unPostLike(userData, tweet, keyInUse);
      if (res.data.success || res.data.error) {
        this.notify(res);
      }
    }
  };

  retweetPost = async () => {
    const { userData, keyInUse } = this.props.auth;
    const tweet = this.props.data;
    let res = null;
    if (!tweet.retweeted) {
      tweet.retweeted = true;
      tweet.retweet_count += 1;
      this.setState({ RtColor: "#17bf63" });
      // this.forceUpdate();
      // post fav only if only tweet wasnt favorited
      res = await postRetweet(userData, tweet, keyInUse);
      if (res.data.success || res.data.error) {
        this.notify(res);
      }
    } else {
      tweet.retweeted = false;
      tweet.retweet_count -= 1;
      this.setState({ RtColor: "#657786" });
      // this.forceUpdate();
      // post fav only if only tweet wasnt favorited
      res = await unPostRetweet(userData, tweet, keyInUse);
      if (res.data.success || res.data.error) {
        this.notify(res);
      }
    }
  };

  notify = res => {
    this.props.enqueueSnackbar({
      message: res.data.success ? res.data.success : res.data.error,
      options: {
        key: new Date().getTime() + Math.random(),
        variant: res.data.success ? "success" : "error",
        action: key => (
          <Button
            style={{ color: "#fff" }}
            onClick={() => this.props.closeSnackbar(key)}
          >
            dismiss
          </Button>
        )
      }
    });

    this.props.setPoints(res.data.points);
  };

  formatCount(count) {
    const readablize = num => {
      var e = Math.floor(Math.log(num) / Math.log(1000));
      return (num / Math.pow(1000, e)).toFixed(1) + "K";
    };

    if (count > 999) return readablize(count);
    else return count;
  }

  render() {
    const { data } = this.props;

    return (
      <div>
        <CardActions>
          <div style={styles.footer}>
            <div style={styles.ProfileTweetAction}>
              {/* comment */}
              <Tooltip title="Comment = 20 Points" aria-label="comment">
                <button
                  style={styles.ProfileTweetActionBtn}
                  onClick={this.handleExpandClick}
                >
                  <div style={styles.IconContainer}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <path opacity="0" d="M0 0h24v24H0z" />
                      <path
                        fill="#657786"
                        d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.004-.005-.008c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"
                      />
                    </svg>
                  </div>
                </button>
              </Tooltip>
            </div>
            <div style={styles.ProfileTweetAction}>
              {/* retweets */}
              <Tooltip title="Retweet = 30 Points" aria-label="Retweet">
                <button
                  style={styles.ProfileTweetActionBtn}
                  onClick={this.retweetPost}
                >
                  <div style={styles.IconContainer}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill={this.state.RtColor}
                        d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"
                      />
                    </svg>
                  </div>
                </button>
              </Tooltip>
              <button style={styles.ProfileTweetActionBtn}>
                <div style={styles.IconTextContainer}>
                  <div style={styles.ProfileTweetActionCount}>
                    {data.retweet_count > 0
                      ? this.formatCount(data.retweet_count)
                      : null}
                  </div>
                </div>
              </button>
            </div>
            <div style={styles.ProfileTweetAction}>
              <Tooltip title="Like Post = 10 Points" aria-label="Like">
                <button
                  style={styles.ProfileTweetActionBtn}
                  onClick={this.favPost}
                >
                  {/* favs */}
                  <div style={styles.IconContainer}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <path opacity="0" d="M0 0h24v24H0z" />
                      {this.props.data.favorited && (
                        <path
                          fill={this.state.favoriteColor}
                          d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"
                        />
                      )}

                      {!this.props.data.favorited && (
                        <path
                          fill={this.state.favoriteColor}
                          d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
                        />
                      )}
                    </svg>
                  </div>
                </button>
              </Tooltip>
              <button style={styles.ProfileTweetActionBtn}>
                <div style={styles.IconTextContainer}>
                  <div style={styles.ProfileTweetActionCount}>
                    {data.favorite_count > 0
                      ? this.formatCount(data.favorite_count)
                      : null}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Input
              placeholder="Say something nice..."
              inputProps={{
                "aria-label": "Description"
              }}
              onKeyDown={this.handleKeyDown}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={this.submitComment}>
                    <Send color="primary" />
                  </IconButton>
                </InputAdornment>
              }
              onChange={this.onValueChanged}
              value={this.state.comment}
            />
          </CardContent>
        </Collapse>
      </div>
    );
  }
}

Footer.propTypes = {
  auth: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  setPoints: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { setPoints, enqueueSnackbar, closeSnackbar }
)(Footer);
