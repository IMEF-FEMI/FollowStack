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
import DoneOutline from "@material-ui/icons/DoneOutline";

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
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.gainFollowers.stats.gained ||
      nextProps.gainFollowers.stats.totalGained
    ) {
      this.handleClickOpen();
    }
  }

  render() {
    const { stats, isUnFollowing } = this.props.gainFollowers;
    return (
      <div>
        {isUnFollowing === true && stats.unFollowed.length === 0 && (
          <div style={container}>
            <Grid container spacing={24} justify="center">
              <Grid item xs={6}>
                <LinearProgress color="secondary" />
              </Grid>
            </Grid>
          </div>
        )}

        {stats.unFollowed.length !== 0 && (
          <Grid container justify="center">
            <Users
              useContext={{ context: "UnFollowed" }}
              users={stats.unFollowed}
            />
          </Grid>
        )}

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
                    {stats.usersFollowed} Users Followed
                  </Grid>
                  <Grid item xs={12} align="center">
                    {stats.gained} Users Following back
                  </Grid>
                  <Grid item xs={12} align="center">
                    {stats.usersUnFollowed} Users Unfollowed
                  </Grid>
                  <Grid item xs={12} align="center">
                    {stats.totalGained} Followers Gained So far
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
  gainFollowers: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  gainFollowers: state.gainFollowers
});

export default connect(mapStateToProps)(UnFollowed);
