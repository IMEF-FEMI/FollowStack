import React, { Component } from "react";
import Button from "@material-ui/core/Button/Button";
import { connect } from "react-redux";
import { SocketContext } from "../../../../../components/SocketContext";

import {
  onSnackbarOpen,
  setSnackbarMessage,
  setSnackbarVariant
} from "../../../../../actions/snackbarAction";
import { setPoints } from "../../../../../actions/authActions";

class FollowButton extends Component {
  state = {
    disabled: false
  };

  // checkFollowPopup() {
  //   const check = setInterval(async () => {
  //     const { followPopup } = this;
  //     if (
  //       !followPopup ||
  //       followPopup.closed ||
  //       followPopup.closed === undefined
  //     ) {
  //       clearInterval(check);
  //       this.setState({ disabled: false });
  //       const { user } = this.props;
  //       user.following = true;
  //       this.forceUpdate();
  //       await follow(this.props.user, this.props.auth.userData);
  //     }
  //   }, 1000);
  // }
  // checkUnfollowPopup() {
  //   const check = setInterval(async () => {
  //     const { unFollowPopup } = this;
  //     if (
  //       !unFollowPopup ||
  //       unFollowPopup.closed ||
  //       unFollowPopup.closed === undefined
  //     ) {
  //       clearInterval(check);
  //       this.setState({ disabled: false });
  //       const { user } = this.props;
  //       user.following = false;
  //       this.forceUpdate();
  //       await unFollow(this.props.user, this.props.auth.userData);
  //     }
  //   }, 1000);
  // }
  // openPopup() {
  //   const width = 300,
  //     height = 300;
  //   const left = window.innerWidth / 2 - width / 2;
  //   const top = window.innerHeight / 2 - height / 2;
  //   const url = `https://twitter.com/${this.props.user.screen_name}`;

  //   return window.open(
  //     url,
  //     "",
  //     `toolbar=no, location=no, directories=no, status=no, menubar=no,
  //         scrollbars=no, resizable=no, copyhistory=no, width=${width},
  //         height=${height}, top=${top}, left=${left}`
  //   );
  // }

  followUser = async () => {
    if (!this.state.disabled && this.props.user.following === false) {
      // this.followPopup = this.openPopup();
      // this.checkFollowPopup();
      const {
        socket,
        auth,
        setSnackbarMessage,
        setSnackbarVariant,
        onSnackbarOpen,
        setPoints,
        user
      } = this.props;
      this.setState({ disabled: true });
      // follow using sockets and notify user
      socket.emit(
        "follow",
        { userData: auth.userData, newUser: user, key: auth.keyInUse },
        points => {
          // callback to show notification when follow is successful
          setSnackbarMessage("👍 Follow successful +40 points earned");
          setSnackbarVariant("success");
          onSnackbarOpen();
          setPoints(points);
        }
      );
      this.setState({ disabled: false });
      user.following = true;

      this.forceUpdate();
    }
  };
  unfollowUser = async () => {
    if (!this.state.disabled && this.props.user.following === true) {
      // this.followPopup = this.openPopup();
      // this.checkFollowPopup();
      if (this.props.usersOnline.hasFollowingsTime >= 1) {
        this.props.setSnackbarMessage(
          "Can't unfollow yet. wait for countdown to complete"
        );
        this.props.setSnackbarVariant("warning");
        this.props.onSnackbarOpen();
      } else {
        const {
          socket,
          auth,
          setSnackbarMessage,
          setSnackbarVariant,
          onSnackbarOpen,
          setPoints,
          user
        } = this.props;
        this.setState({ disabled: true });
        socket.emit(
          "unfollow",
          { userData: auth.userData, newUser: user, key: auth.keyInUse },
          points => {
            // callback to show notification when unfollow is successful

            setSnackbarMessage("👎 User Unfollowed successful -40 points");
            setSnackbarVariant("warning");
            onSnackbarOpen();
            setPoints(points);
          }
        );
        this.setState({ disabled: false });
        user.following = false;

        this.forceUpdate();
      }
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
    const followsYouButton = (
      <Button
        color="primary"
        size="medium"
        variant="contained"
        style={{
          borderRadius: "100px",
          backgroundColor: "#28a745",
          borderColor: "#28a745"
        }}
        disabled={this.state.disabled}
        onClick={() => {
          this.props.setSnackbarMessage(
            "Click the Unfollow Tab to Unfollow Users"
          );
          this.props.setSnackbarVariant("info");
          this.props.onSnackbarOpen();
        }}
      >
        {"Follows you"}
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
      case "Followed Back":
        button = followsYouButton;
        break;
      case "UnFollowed":
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
  { onSnackbarOpen, setSnackbarMessage, setSnackbarVariant, setPoints }
)(FollowButtonWithSocket);
