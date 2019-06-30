import React, { Component } from "react";

import theme from "../theme/instapaper/theme";
import withTheme from "../theme/withTheme";
import Box from "@material-ui/core/Box";
import { connect } from "react-redux";
import { logoutUser } from "../../../../actions/authActions";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { SocketContext } from "../../../../components/SocketContext";

const welcome_user = {
  color: "#fff",
  fontFamily: "Nunito, sans-serif",
  fontSize: "30px",
  textAlign: "center",
  marginBottom: "3rem",
  maxWidth: "500px",
  marginLeft: "auto",
  marginRight: "auto"
};
let logout_icon_index = {
  display: "block",
  margin: "0 auto",
  position: "relative",
  textAlign: "center",
  overflow: "hidden",
  width: "75px",
  height: "75px",
  fontSize: "50px",
  lineHeight: "150px",
  backgroundColor: "#f50057",
  borderRadius: "15px"
};

const twitter_icon_index = {
  display: "block",
  margin: "0 auto",
  position: "relative",
  textAlign: "center",
  overflow: "hidden",
  width: "75px",
  height: "75px",
  fontSize: "50px",
  lineHeight: "150px",
  backgroundColor: "#3897f0",
  borderRadius: "15px"
};
const category_text = {
  fontWeight: "500",
  fontSize: "20px",
  letterSpacing: "-0.06px",
  lineHeight: "24px",
  color: "#fff",
  textAlign: "center",
  fontFamily: "Nunito, sans-serif",
  marginBottom: "0",
  paddingTop: "10px",
  display: "block",
  margin: "0 auto"
};

class DashBoard extends Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.hasWindowSizeChange);
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.hasWindowSizeChange);
  }

  hasWindowSizeChange = () => {
    this.setState({
      width: window.innerWidth
    });
  };
  push = url => {
    this.props.history.push(url);
  };
  render() {
    const bgimage = require("../../assets/img/green.jpg");
    return (
      <div
        style={{
          height: this.state.width >= 600 ? "110vh" : "140vh",
          // height: `${window.innerHeight * 1.11}px`,
          backgroundImage: "url(" + bgimage + ")",
          backgroundColor: "#2c3e50",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        }}
      >
        <Box mb="44px" style={{ paddingTop: "50px" }}>
          <div>
            <Grid
              item
              xs={12}
              // className={window.innerWidth >= 500 ? `mobilePadding` : ""}
            >
              <div
                className="mb-3 welcome-block"
                style={{ paddingTop: "40px" }}
              >
                <Typography style={welcome_user} variant="h3">
                  Welcome {this.props.auth.userData.username}
                </Typography>
              </div>
            </Grid>
          </div>
        </Box>
        <div>
          <Grid container>
            {
              <Grid item xs={12} sm={6} className="mobilePadding">
                <div
                  style={twitter_icon_index}
                  id="icon-box-twitter"
                  onClick={() => {
                    this.push("/gain-followers");
                  }}
                >
                  <span>
                    <i className="fa fa-users fa fa-lg-modification" />
                  </span>
                </div>
                {
                  <Typography
                    variant="h4"
                    style={category_text}
                    className="tooltip-bottom"
                    data-tooltip={
                      "You Gain Followers by Following a number of accounts, wait for a while and unfollow ONLY those that refuse to follow back"
                    }
                  >
                    {" "}
                    Gain Followers
                  </Typography>
                }
              </Grid>
            }

            {
              <Grid item xs={12} sm={6} className="mobilePadding">
                <div
                  style={twitter_icon_index}
                  id="icon-box-twitter"
                  onClick={() => {
                    this.push("/shared-tweets");
                  }}
                >
                  <span>
                    <i className="fab fa-twitter fa-lg-modification" />
                  </span>
                </div>
                {
                  <Typography
                    variant="h4"
                    style={category_text}
                    className="tooltip-bottom"
                    data-tooltip={
                      "Collection of tweets by fellow FollowStack users. Commenting and liking tweets earn you points which you'd use to also add your own tweet"
                    }
                  >
                    {" "}
                    Blow Up Some Tweets
                  </Typography>
                }
              </Grid>
            }

            {
              <Grid item xs={12} sm={6} className="mobilePadding">
                <div
                  style={twitter_icon_index}
                  id="icon-box-twitter"
                  onClick={() => {
                    this.push(`/profile`);
                  }}
                >
                  <span>
                    <i className="far fa-user fa fa-lg-modification" />
                    <i className="fa fa-sign-out-alt fa fa-lg-modification" />
                  </span>
                </div>
                {
                  <Typography
                    variant="h4"
                    style={category_text}
                    className="tooltip-bottom"
                    data-tooltip={"My Profile"}
                  >
                    {" "}
                    Blow Up My Wall
                  </Typography>
                }
              </Grid>
            }
            {
              <Grid item xs={12} sm={6} className="mobilePadding">
                <div
                  style={logout_icon_index}
                  id="logout-icon-box"
                  onClick={() => {
                    this.props.logoutUser();
                    this.props.socket.emit("disconnect");
                  }}
                >
                  <span>
                    <i className="fa fa-sign-out-alt fa fa-lg-modification" />
                  </span>
                </div>
                {
                  <Typography
                    variant="h4"
                    style={category_text}
                    className="tooltip-bottom"
                    data-tooltip={"Sign Out"}
                  >
                    {" "}
                    Sign Out
                  </Typography>
                }
              </Grid>
            }
          </Grid>
        </div>
      </div>
    );
  }
}

DashBoard.propTypes = {
  auth: PropTypes.object.isRequired
};

const DashBoardWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <DashBoard {...props} socket={socket} />}
  </SocketContext.Consumer>
);
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(withTheme(theme)(DashBoardWithSocket)));
