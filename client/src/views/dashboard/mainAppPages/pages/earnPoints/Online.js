import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { SocketContext } from "../../../../../components/SocketContext";
import { connect } from "react-redux";
import {
  initialFetchAction,
  fetchNextAction,
  refreshAction
} from "../../../../../actions/usersAction";
import { onScroll } from "../../components/tweet/utils";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Refresh from "@material-ui/icons/Refresh";
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
  paddingBottom: "20vh"
};

class Online extends Component {
  constructor() {
    super();
    this.onScroll = onScroll.call(this, this.fetchNextPage);
  }
  fetchNextPage = async () => {
    const { socket, users, fetchNextAction, auth } = this.props;

    if (users.initialFetch || users.isFetching || !users.hasMore) {
      return;
    }
    await fetchNextAction(
      socket,
      users.users.length,
      users.page,
      auth.userData,
      auth.keyInUse
    );
  };

  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);

    const { socket, users, initialFetchAction, auth } = this.props;
    if (users.initialFetch === true) {
      await initialFetchAction(
        socket,
        users.users.length,
        users.page,
        auth.userData,
        auth.keyInUse
      );
    }
  }
  componentWillUnmount() {
    // Remove onScroll event listener
    window.removeEventListener("scroll", this.onScroll, false);
  }

  refresh = async () => {
    const {
      socket,
      users,
      auth,
      initialFetchAction,
      refreshAction
    } = this.props;
    await refreshAction();
    initialFetchAction(
      socket,
      users.users.length,
      users.page,
      auth.userData,
      auth.keyInUse
    );
  };
  render() {
    const { users, initialFetch, isFetching } = this.props.users;
    return (
      <React.Fragment>
        <Grid container justify="center">
          <Grid item>
            <Button variant="outlined" onClick={this.refresh}>
              Refresh
              <Refresh />
            </Button>
          </Grid>
        </Grid>

        {initialFetch && (
          <div style={container}>
            <Grid container justify="center">
              <Grid item>
                <CircularProgress />
              </Grid>
            </Grid>
          </div>
        )}
        {!initialFetch &&
          (users.length === 0 ||
            (users.length === 1 &&
              users[0].user_id === this.props.auth.user.userid)) && (
            <div style={container}>
              <Typography
                variant="h2"
                style={{ color: "#000" }}
                gutterBottom
                align="center"
              >
                There are no users Online! Check Back Later
              </Typography>
            </div>
          )}
        {!initialFetch && users.length >= 1 && (
          <Grid container justify="center">
            <Users users={users} currentUser={this.props.auth.user} />
          </Grid>
        )}
        {users.length !== 0 && isFetching && (
          <Grid item xs={12}>
            <CircularProgress
              style={{
                margin: "16px auto",
                display: "block"
              }}
              size={50}
            />
          </Grid>
        )}
      </React.Fragment>
    );
  }
}

const OnlineWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <Online {...props} socket={socket} />}
  </SocketContext.Consumer>
);
const mapStateToProps = state => ({
  auth: state.auth,
  users: state.users
});
export default connect(
  mapStateToProps,
  { initialFetchAction, fetchNextAction, refreshAction }
)(OnlineWithSocket);
