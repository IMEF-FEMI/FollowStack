import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import {SocketContext} from '../../../../../components/SocketContext'


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
  render() {
    return (
      <div style={container}>
        <Grid container justify="center">
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const OnlineWithSocket = props => (
    <SocketContext.Consumer>
      {socket => <Online {...props} socket={socket} />}
    </SocketContext.Consumer>
  )
export default OnlineWithSocket;
