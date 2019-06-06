import React, { Component } from "react";

import theme from "./mainAppPages/theme/instapaper/theme";
import withTheme from "./mainAppPages/theme/withTheme";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withRouter } from "react-router-dom";

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
  color: "#fff",
  textAlign: "center",
  fontFamily: "Nunito, sans-serif",
  fontSize: "20px",
  fontWeight: "400",
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
    const bgimage = require("./assets/img/green.jpg");
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
        <Box mb="44px">
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
                <p style={welcome_user}>
                  Welcome {this.props.auth.userData.username}
                </p>
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
                  <p
                    style={category_text}
                    className="tooltip-bottom"
                    data-tooltip={
                      "You Gain Followers by Following a number of accounts, wait for a while and unfollow ONLY those that refuse to follow back"
                    }
                  >
                    {" "}
                    Gain Followers
                  </p>
                }
              </Grid>
            }

            {
              <Grid item xs={12} sm={6} className="mobilePadding">
                <div
                  style={twitter_icon_index}
                  id="icon-box-twitter"
                  onClick={() => {
                    this.push("/users-online");
                  }}
                >
                  <span>
                    <i className="fa fa-users fa fa-lg-modification" />
                  </span>
                </div>
                {
                  <p
                    style={category_text}
                    className="tooltip-bottom"
                  >
                    {" "}
                    Users Online
                  </p>
                }
              </Grid>
            }

            {
              <Grid item xs={12} sm={6} className="mobilePadding">
                <div
                  style={twitter_icon_index}
                  id="icon-box-twitter"
                  onClick={() => {
                    this.push("/tweets");
                  }}
                >
                  <span>
                    <i className="fab fa-twitter fa-lg-modification" />
                  </span>
                </div>
                {
                  <p
                    style={category_text}
                    className="tooltip-bottom"
                    data-tooltip={
                      "Collection of tweets by fellow FollowStack users. Commenting and liking tweets earn you points which you'd use to also add your own tweet"
                    }
                  >
                    {" "}
                    View Tweets
                  </p>
                }
              </Grid>
            }

            {
              <Grid item xs={12} sm={6} className="mobilePadding">
                <div
                  style={twitter_icon_index}
                  id="icon-box-twitter"
                  onClick={() => {
                    this.push(`/${this.props.auth.userProfile.screen_name}`);
                  }}
                >
                  <span>
                    <i className="far fa-user fa fa-lg-modification" />
                  </span>
                </div>
                {
                  <p
                    style={category_text}
                    className="tooltip-bottom"
                    data-tooltip={
                      "My Profile"
                    }
                  >
                    {" "}
                   My Profile
                  </p>
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
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(
  withRouter(withTheme(theme)(DashBoard))
);
