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
    const { socket, users, fetchNextAction } = this.props;

    if (users.initialFetch || users.isFetching || !users.hasMore) {
      return;
    }
    await fetchNextAction(socket, users.users.length, users.page);
  };

  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);

    const { socket, users, initialFetchAction } = this.props;
    if (users.initialFetch === true) {
      await initialFetchAction(socket, users.users.length, users.page);
    }
  }
  componentWillUnmount() {
    // Remove onScroll event listener
    window.removeEventListener("scroll", this.onScroll, false);
  }
  render() {
    const { users, initialFetch, hasMore } = this.props.users;
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
        {users.length === 0 && !hasMore && (
          <div style={container}>
            <Typography
              variant="h2"
              style={{ color: "#000" }}
              gutterBottom
              align="center"
            >
              There's Nobody Online! Check Back Later
            </Typography>
          </div>
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
