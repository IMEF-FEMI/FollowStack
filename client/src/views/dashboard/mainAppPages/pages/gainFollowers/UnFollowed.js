import React, { Component } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { connect } from "react-redux";
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
          <Users
            useContext={{ context: "UnFollowed" }}
            users={stats.unFollowed}
          />
        )}
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
