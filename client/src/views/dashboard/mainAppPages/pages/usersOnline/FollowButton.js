import React, { Component } from "react";
import Button from "@material-ui/core/Button/Button";
import { connect } from "react-redux";
import { SocketContext } from "../../../../../components/SocketContext";

import {
  enqueueSnackbar,
  closeSnackbar
} from "../../../../../actions/notistackActions";
import { setPoints } from "../../../../../actions/authActions";
import { trackEvent } from "../../../../../components/Tracking";

class FollowButton extends Component {
  state = {
    disabled: false
  };


  followUser = async () => {
    if (!this.state.disabled && this.props.user.following === false) {
      const {
        socket,
        enqueueSnackbar,
        closeSnackbar,
        setPoints,
        user
      } = this.props;
      this.setState({ disabled: true });
      trackEvent("Following User")
      // follow using sockets and notify user
      socket.emit("follow", { newUser: user }, data => {
        if (data.success) {
          // callback to show notification when follow is successful

          enqueueSnackbar({
            message: "👍 Follow successful",
            options: {
              key: new Date().getTime() + Math.random(),
              variant: "success",
              action: key => (
                <Button
                  style={{ color: "#fff" }}
                  onClick={() => closeSnackbar(key)}
                >
                  dismiss
                </Button>
              )
            }
          });
          setPoints(data.points);
        } else {
          enqueueSnackbar({
            message: data.error,
            options: {
              key: new Date().getTime() + Math.random(),
              variant: "error",
              action: key => (
                <Button
                  style={{ color: "#fff" }}
                  onClick={() => closeSnackbar(key)}
                >
                  dismiss
                </Button>
              )
            }
          });
        }
      });
      this.setState({ disabled: false });
      user.following = true;

      this.forceUpdate();
    }
  };
  unfollowUser = async () => {
    if (!this.state.disabled && this.props.user.following === true) {
      // this.followPopup = this.openPopup();
      // this.checkFollowPopup();
      trackEvent("UnFollowing User")

      const { socket, enqueueSnackbar, closeSnackbar, user } = this.props;
      this.setState({ disabled: true });
      socket.emit("unfollow", { newUser: user }, () => {
        // callback to show notification when unfollow is successful

        enqueueSnackbar({
          message: "👎 User Unfollowed",
          options: {
            key: new Date().getTime() + Math.random(),
            variant: "error",
            action: key => (
              <Button
                style={{ color: "#fff" }}
                onClick={() => closeSnackbar(key)}
              >
                dismiss
              </Button>
            )
          }
        });
      });
      this.setState({ disabled: false });
      user.following = false;

      this.forceUpdate();
    }
  };
  render() {
    const { user, context } = this.props;

    const followButton = (
      <Button
        color="primary"
        size="medium"
        variant="outlined"
        style={{ borderRadius: "100px" }}
        disabled={this.state.disabled}
        onClick={this.followUser}
      >
        {"follow"}
      </Button>
    );
    const followingButton = (
      <Button
        color="primary"
        size="medium"
        variant="contained"
        style={{ borderRadius: "100px" }}
        disabled={this.state.disabled}
        onClick={this.unfollowUser}
      >
        {"following"}
      </Button>
    );
    var button = null;
    switch (context.context) {
      case "Online":
        if (user.following) {
          button = followingButton;
        } else {
          button = followButton;
        }
        break;
      default:
        button = <Button />;
        break;
    }

    return <div>{button}</div>;
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  usersOnline: state.usersOnline
});
const FollowButtonWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <FollowButton {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default connect(
  mapStateToProps,
  { enqueueSnackbar, closeSnackbar, setPoints }
)(FollowButtonWithSocket);
