import React, { Component } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import PersonAdd from "@material-ui/icons/PersonAdd";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core";


import {
  getOnlineUsersAction,
  checkFollowingAction,
  setProgress,
  clearError
} from "../../../../../actions/usersOnlineAction";
import { connect } from "react-redux";
import Users from "./Users";
import atoms from "../../components/atoms";
import {
  onSnackbarOpen,
  setSnackbarMessage,
  setSnackbarVariant
} from "../../../../../actions/snackbarAction";
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

class Followed extends Component {
  state = {
    completed: 0
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors.newFollowersError) {
      this.props.setSnackbarMessage(nextProps.errors.newFollowersError);
      this.props.setSnackbarVariant("error");
      this.props.onSnackbarOpen();
      this.props.clearError();
    } else if (nextProps.errors.serverError) {
      this.props.setSnackbarMessage(nextProps.errors.serverError);
      this.props.setSnackbarVariant("error");
      this.props.onSnackbarOpen();
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
    this.props.checkFollowingAction(this.props.auth.userData.userid);
  }
  progress = () => {
    const { linearProgressBarCompleted, gettingUsers } = this.props.usersOnline;
    if (linearProgressBarCompleted === 100) {
      clearInterval(this.timer);
    } else if (gettingUsers && linearProgressBarCompleted !== 100) {
      const diff = Math.random() * 1;
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
              <Grid container justify="center">
                <Grid item>
                  <Button
                    variant="outlined"
                    fullWidth={!upSm}
                    onClick={() => {
                      this.props.getOnlineUsersAction(
                        this.props.auth.userData,
                        this.props.auth.keyInUse
                      );
                    }}
                  >
                    Get Users
                    <PersonAdd />
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}

        {hasFollowings === false && checkingFollowings === true && (
          <div style={container}>
            <Grid container justify="center">
              <Grid item>
                <CircularProgress />
              </Grid>
            </Grid>
          </div>
        )}

        {(gettingUsers === true || isUnFollowing === true) &&
          checkingFollowings === false &&
          onlineUsers.length === 0 && (
            <div style={container}>
              <Grid container justify="center">
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

export default withStyles(styles)(connect(
  mapStateToProps,
  {
    getOnlineUsersAction,
    checkFollowingAction,
    setProgress,
    clearError,
    onSnackbarOpen,
    setSnackbarMessage,
    setSnackbarVariant
  }
)(Followed));
