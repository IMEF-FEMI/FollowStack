import React, { Component } from "react";
import PropTypes from "prop-types";
// import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import PersonAdd from "@material-ui/icons/PersonAdd";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";

import {
  getOnlineUsersAction,
  checkFollowingAction,
  setProgress,
  clearError
} from "../../../../../actions/usersOnlineAction";
import { connect } from "react-redux";
import Users from "./Users";
import atoms from "../../components/atoms";
import CustomSnackbar from "../../../../../components/CustomSnackbar"

const { Button } = atoms;

const containerFluid = {
  paddingRight: "15px",
  paddingLeft: "15px",
  marginRight: "auto",
  marginLeft: "auto",
  width: "100%"
};

const container = {
  ...containerFluid,
  zIndex: "2",
  position: "relative",
  paddingTop: "20vh",
  paddingBottom: "20vh",
  color: "#FFFFFF"
};

class Followed extends Component {
  state = {
    // newFollowersError: "",
    completed: 0
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors.newFollowersError) {
      this.setState(
        {
          snackbarMessage: nextProps.errors.newFollowersError,
          snackbarvariant: "error"
        },
        () => {
          this.onSnackbarOpen();
        }
      );
      this.props.clearError();
    } else if (nextProps.errors.serverError) {
      this.setState(
        {
          snackbarMessage: nextProps.errors.serverError,
          snackbarvariant: "error"
        },
        () => {
          this.onSnackbarOpen();
        }
      );
      this.props.clearError();
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidMount() {
    const { linearProgressBarCompleted } = this.props.usersOnline;
    if (linearProgressBarCompleted !== 100) {
      this.timer = setInterval(this.progress, 500);
    }
    if (this.props.usersOnline.onlineUsers.length === 0) {
      this.props.checkFollowingAction(this.props.auth.userData.userid);
    }
  }
  progress = () => {
    const { linearProgressBarCompleted, gettingUsers } = this.props.usersOnline;
    if (linearProgressBarCompleted === 100) {
      clearInterval(this.timer);
      // this.setState({ linearProgressBarCompleted: 0 });
    } else if (gettingUsers && linearProgressBarCompleted !== 100) {
      const diff = Math.random() * 2;
      this.props.setProgress(Math.min(linearProgressBarCompleted + diff, 100));
    }
  };
  render() {
    const {
      hasFollowings,
      onlineUsers,
      checkingFollowings,
      gettingUsers,
      isUnFollowing,
      linearProgressBarCompleted
    } = this.props.usersOnline;
    const upSm = window.innerWidth >= 600;

    return (
      <div>
        {hasFollowings === false &&
          checkingFollowings === false &&
          gettingUsers === false &&
          isUnFollowing === false &&
          onlineUsers.length === 0 && (
            <div style={container}>
              <Grid container spacing={16} justify="center">
                <Grid item>
                  <Button
                    // className={classes.editButton}
                    variant="outlined"
                    fullWidth={!upSm}
                    onClick={() => {
                      this.props.getOnlineUsersAction(
                        this.props.auth.userData,
                        this.props.auth.keyInUse
                      );
                    }}
                  >
                    Get Online Users
                    <PersonAdd />
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}

        {hasFollowings === false && checkingFollowings === true && (
          <div style={container}>
            <Grid container spacing={16} justify="center">
              <Grid item>
                <CircularProgress />
              </Grid>
            </Grid>
          </div>
        )}

        {(gettingUsers === true || isUnFollowing === true) &&
          checkingFollowings === false && (
            <div style={container}>
              <Grid container spacing={24} justify="center">
                <Grid item xs={6}>
                  <LinearProgress
                    variant="determinate"
                    value={linearProgressBarCompleted}
                  />
                </Grid>
              </Grid>
            </div>
          )}

        {hasFollowings === true && onlineUsers.length !== 0 && (
          <Grid container justify="center">
            <Users useContext={{ context: "Followed" }} users={onlineUsers} />
          </Grid>
        )}

        <CustomSnackbar
          snackbarOpen={this.state.snackbarOpen}
          variant={this.state.snackbarvariant}
          message={this.state.snackbarMessage}
          onSnackbarOpen={this.onSnackbarOpen}
          onSnackbarClose={this.onSnackbarClose}
          horizontal={this.state.horizontal}
          vertical={this.state.vertical}
        />
      </div>
    );
  }
}
Followed.propTypes = {
  auth: PropTypes.object.isRequired,
  usersOnline: PropTypes.object.isRequired,
  getOnlineUsersAction: PropTypes.func.isRequired,
  checkFollowingAction: PropTypes.func.isRequired,
  setProgress: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  usersOnline: state.usersOnline,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {
    getOnlineUsersAction,
    checkFollowingAction,
    setProgress,
    clearError
  }
)(Followed);
