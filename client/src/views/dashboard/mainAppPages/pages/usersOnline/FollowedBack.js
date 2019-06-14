import React, { Component } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import {
  checkFollowedBackAction,
  clearError
} from "../../../../../actions/usersOnlineAction";
import { connect } from "react-redux";
import Users from "./Users";
import CustomSnackbar from "../../../../../components/CustomSnackbar"


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
  state = {
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarvariant: "",
    vertical: 'top',
    horizontal: 'right',
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
  onSnackbarOpen = () => {
    this.setState({ snackbarOpen: true }, () => {});
  };

  onSnackbarClose = () => {
    this.setState({ snackbarOpen: false }, () => {});
  };
  componentDidMount() {
    this.props.checkFollowedBackAction(
      this.props.auth.userData,
      this.props.auth.keyInUse
    );
  }
 

  render() {
    const {
      checkingFollowedBack,
      followedBack,
      onlineUsers
    } = this.props.usersOnline;
    const context = { context: "Followed Back" };
    return (
      <div>
      

        {checkingFollowedBack === true && followedBack.length === 0 && (
          <div style={container}>
            <Grid container justify="center">
              <Grid item xs={6}>
                <LinearProgress />
              </Grid>
            </Grid>
          </div>
        )}

        {followedBack.length !== 0 && (
          <Grid container justify="center">
            <Users useContext={context} users={followedBack} />
          </Grid>
        )}

        {onlineUsers.length !== 0 &&
          followedBack.length === 0 &&
          checkingFollowedBack === false && (
            <div style={container}>
              <Typography variant="h2" style={{color:"#000"}} gutterBottom align="center">
                No Follow Backs Yet! Check Back Later
              </Typography>
            </div>
          )}

        {onlineUsers.length === 0 &&
          followedBack.length === 0 &&
          checkingFollowedBack === false && (
            <div style={container}>
              <Typography variant="h2" style={{color:"#000"}} gutterBottom align="center">
                You currently have no Followings! Click on the Follows TAB to
                start
              </Typography>
            </div>
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
FollowedBack.propTypes = {
  auth: PropTypes.object.isRequired,
  usersOnline: PropTypes.object.isRequired,
  checkFollowedBackAction: PropTypes.func.isRequired,
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
    checkFollowedBackAction,
    clearError
  }
)(FollowedBack);
