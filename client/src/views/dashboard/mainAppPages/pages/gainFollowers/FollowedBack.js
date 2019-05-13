import React, { Component } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import {
  checkFollowedBackAction,
  clearError
} from "../../../../../actions/gainFollowersAction";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Users from "./Users";

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

class FollowedBack extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors.newFollowersError) {
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

  componentDidMount() {
    this.props.checkFollowedBackAction(this.props.auth.userData);
  }

  render() {
    const {
      checkingFollowedBack,
      followedBack,
      followings
    } = this.props.gainFollowers;
    const context = { context: "Followed Back" };
    return (
      <div>
        <ToastContainer />

        {checkingFollowedBack === true && followedBack.length === 0 && (
          <div style={container}>
            <Grid container spacing={24} justify="center">
              <Grid item xs={6}>
                <LinearProgress />
              </Grid>
            </Grid>
          </div>
        )}

        {followedBack.length !== 0 && (
          <Users useContext={context} users={followedBack} />
        )}

        {followings.length !== 0 &&
          followedBack.length === 0 &&
          checkingFollowedBack === false && (
            <div style={container}>
              <Typography variant="h2" gutterBottom align="center">
                No Follow Backs at this time! Check Back Later
              </Typography>
            </div>
          )}

        {followings.length === 0 &&
          followedBack.length === 0 &&
          checkingFollowedBack === false && (
            <div style={container}>
              <Typography variant="h2" gutterBottom align="center">
                You currently have no followings! Click on the Follows TAB to
                start
              </Typography>
            </div>
          )}
      </div>
    );
  }
}
FollowedBack.propTypes = {
  auth: PropTypes.object.isRequired,
  checkFollowedBackAction: PropTypes.func.isRequired,
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
    checkFollowedBackAction,
    clearError
  }
)(FollowedBack);
