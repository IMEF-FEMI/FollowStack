import React, { Component } from "react";
import PropTypes from "prop-types";
// import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import PersonAdd from "@material-ui/icons/PersonAdd";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";

import {
  gainFollowersAction,
  checkFollowingAction,
  setProgress,
  clearError
} from "../../../../../actions/gainFollowersAction";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Users from "./Users";
import atoms from "../../components/atoms";
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
    if (
      nextProps.errors.newFollowersError
      // &&
      // (this.state.newFollowersError !== nextProps.errors.newFollowersError)
    ) {
      // this.setState({newFollowersError: nextProps.errors.newFollowersError})
      toast.warn(" ⚠️️ " + nextProps.errors.newFollowersError, {
        position: "bottom-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      this.props.clearError();
    } else if (nextProps.errors.serverError) {
      toast.error("❌ " + nextProps.errors.serverError, {
        position: "bottom-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      this.props.clearError();
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  beginFollow = () => {
    this.props.gainFollowersAction(
      this.props.auth.userData,
      this.props.auth.keyInUse
    );
  };

  componentDidMount() {
    const { linearProgressBarCompleted } = this.props.gainFollowers;
    if (linearProgressBarCompleted !== 100) {
      this.timer = setInterval(this.progress, 500);
    }
    this.props.checkFollowingAction(this.props.auth.userData.userid);
  }
  progress = () => {
    const {
      linearProgressBarCompleted,
      isFollowing
    } = this.props.gainFollowers;
    if (linearProgressBarCompleted === 100) {
      clearInterval(this.timer);
      // this.setState({ linearProgressBarCompleted: 0 });
    } else if (isFollowing && linearProgressBarCompleted !== 100) {
      const diff = Math.random() * 1;
      this.props.setProgress(Math.min(linearProgressBarCompleted + diff, 100));
    }
  };
  render() {
    const {
      hasFollowings,
      followings,
      checkingFollowings,
      isFollowing,
      isUnFollowing,
      linearProgressBarCompleted
    } = this.props.gainFollowers;
    const upSm = window.innerWidth >= 600;

    return (
      <div>
        <ToastContainer />
        {hasFollowings === false &&
          checkingFollowings === false &&
          isFollowing === false &&
          isUnFollowing === false &&
          followings.length === 0 && (
            <div style={container}>
              <Grid container spacing={16} justify="center">
                <Grid item>
                  <Button
                    // className={classes.editButton}
                    variant="outlined"
                    fullWidth={!upSm}
                    onClick={this.beginFollow}
                  >
                    Click To Begin
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

        {(isFollowing === true || isUnFollowing === true) &&
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

        {hasFollowings === true && followings.length !== 0 && (
          <Grid container justify="center"
            
          >
            <Users useContext={{ context: "Followed" }} users={followings} />
          </Grid>
        )}
      </div>
    );
  }
}
Followed.propTypes = {
  auth: PropTypes.object.isRequired,
  gainFollowers: PropTypes.object.isRequired,
  gainFollowersAction: PropTypes.func.isRequired,
  checkFollowingAction: PropTypes.func.isRequired,
  setProgress: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  gainFollowers: state.gainFollowers,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {
    gainFollowersAction,
    checkFollowingAction,
    setProgress,
    clearError
  }
)(Followed);
