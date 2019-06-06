import React, { Component } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import DoneOutline from "@material-ui/icons/DoneOutline";
import PersonAddDisabled from "@material-ui/icons/PersonAddDisabled";
import {
  getNotFollowingBackAction,
  finishedUnFollowAction
} from "../../../../../actions/usersOnlineAction";
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

class UnFollowed extends Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  componentDidMount() {
    this.props.getNotFollowingBackAction(
      this.props.auth.userData,
      this.props.auth.keyInUse
    );
  }

  render() {
    const { notFollowingBack, onlineUsers, checkingNotFollowedBack } = this.props.usersOnline;
    return (
      <div>
        {checkingNotFollowedBack === true && notFollowingBack.length === 0 && (
          <div style={container}>
            <Grid container spacing={24} justify="center">
              <Grid item xs={6}>
                <LinearProgress color="secondary" />
              </Grid>
            </Grid>
          </div>
        )}

        {notFollowingBack.length !== 0 && (
          <Grid container justify="center">
            <Users
              useContext={{ context: "UnFollowed" }}
              users={notFollowingBack}
            />
          </Grid>
        )}
        {onlineUsers.length === 0 &&
          notFollowingBack.length === 0 &&
          checkingNotFollowedBack === false && (
            <div style={container}>
              <Typography variant="h2" gutterBottom align="center">
                You currently have no Followings! Click on the Follows TAB to
                start
              </Typography>
            </div>
          )}

        {
          <Grid container justify="center">
            <Button
              // className={classes.editButton}
              variant="contained"
              color="primary"
              onClick={async () => {
                await this.props.finishedUnFollowAction(
                  this.props.auth.userData,
                  this.props.auth.keyInUse
                );
                this.handleClickOpen();
              }}
            >
              Finish
              <PersonAddDisabled />
            </Button>
          </Grid>
        }

        {
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Unfollow Complete"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Grid container spacing={24} justify="center">
                  <Grid item xs={12} align="center">
                    <DoneOutline />
                  </Grid>
                  <Grid item xs={12} align="center">
                    Unfollowing Complete
                  </Grid>
                </Grid>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        }
      </div>
    );
  }
}
UnFollowed.propTypes = {
  auth: PropTypes.object.isRequired,
  getNotFollowingBackAction: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  usersOnline: state.usersOnline
});

export default connect(
  mapStateToProps,
  { getNotFollowingBackAction, finishedUnFollowAction }
)(UnFollowed);
