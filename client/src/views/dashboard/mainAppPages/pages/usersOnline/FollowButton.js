import React, { Component } from "react";
import Button from "@material-ui/core/Button/Button";
import { connect } from "react-redux";
import { follow, unFollow } from "../../../../../async/usersOnline";
import {
  onSnackbarOpen,
  setSnackbarMessage,
  setSnackbarVariant
} from "../../../../../actions/snackbarAction";

class FollowButton extends Component {
  state = {
    disabled: false,
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
    if (!this.state.disabled) {
      // this.followPopup = this.openPopup();
      // this.checkFollowPopup();
      this.setState({ disabled: true });

      const res = await follow(
        this.props.user,
        this.props.auth.userData,
        this.props.auth.keyInUse
      );
      this.setState({ disabled: false });
      this.props.user.following = res.data.res === "user followed";

      this.forceUpdate();
    }
  };
  unfollowUser = async () => {
    if (this.props.usersOnline.hasFollowingsTime >= 1) {
   
      this.props.setSnackbarMessage(
        "Can't unfollow yet. wait for countdown to complete",
      );
      this.props.setSnackbarVariant("warning");
      this.props.onSnackbarOpen();
      
    } else {
      this.setState({ disabled: true });

      const res = await unFollow(
        this.props.user,
        this.props.auth.userData,
        this.props.auth.keyInUse
      );
      this.setState({ disabled: false });
      this.props.user.following = res.data.res !== "user unfollowed";
      this.forceUpdate();
    }
  };
  render() {
    const { context, user } = this.props;
    var button = null;
    switch (context) {
      case "Followed":
        if (user.following) {
          button = (
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
        } else {
          button = (
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
        }
        break;
      case "Followed Back":
        button = (
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
        break;
      case "UnFollowed":
        if (user.following) {
          button = (
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
        } else {
          button = (
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

export default connect(
  mapStateToProps,
  { onSnackbarOpen, setSnackbarMessage, setSnackbarVariant }
)(FollowButton);
