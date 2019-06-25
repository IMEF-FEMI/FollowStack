import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { SocketContext } from "../../../../../components/SocketContext";
import { connect } from "react-redux";
import {
  initialFetchAction,
  fetchNextAction
} from "../../../../../actions/usersAction";
import { onScroll } from "../../components/tweet/utils";
import Typography from "@material-ui/core/Typography";
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
  render() {
    const { users, initialFetch, isFetching } = this.props.users;
    const check =
      users.length === 1 && users[0].user_id === this.props.auth.user.userid;
    return (
      <React.Fragment>
        {initialFetch && (
          <div style={container}>
            <Grid container justify="center">
              <Grid item>
                <CircularProgress />
              </Grid>
            </Grid>
          </div>
        )}
        {!initialFetch && (users.length === 0 || check) && (
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
        {users.length !== 0 && (
          <Grid container justify="center">
            <Users users={users} />
          </Grid>
        )}
        {isFetching && (
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
  { initialFetchAction, fetchNextAction }
)(OnlineWithSocket);
