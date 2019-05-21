import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

let welcome_user = {
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

let twitter_icon_index = {
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
let category_text = {
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

class DashBoard extends React.Component {
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
    const { width } = this.state;
    const isMobile = width <= 575;
    return (
      <div>
        <div
          style={{
            height: "100vh",
            position: "relative"
          }}
        >
          {/* drop thelayout by 30% if not mobile */}
          <div
            style={{ top: isMobile ? "0%" : "30%", position: "relative" }}
            // className="container"
          >
            {/* display Welcome text here if not mobile */}
            {!isMobile && (
              <div className="mb-3 welcome-block">
                <p style={welcome_user}>
                  Welcome {this.props.auth.userData.username}
                </p>
              </div>
            )}

            <Grid container spacing={24}>
              {isMobile && (
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 mobilePadding">
                  {/* display mobile text here if mobile */}
                  <div
                    className="mb-3 welcome-block"
                    style={{ paddingTop: "100px" }}
                  >
                    <p style={welcome_user}>
                      Welcome {this.props.auth.userData.username}
                    </p>
                  </div>
                </div>
              )}
              {
                <Grid item xs={6} className="mobilePadding">
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
                <Grid item xs={6} className="mobilePadding">
                  <div
                    style={twitter_icon_index}
                    id="icon-box-twitter"
                    onClick={() => {
                      this.push("/gain-followers");
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
                        "You Gain Followers by Following a number of accounts, wait for a while and unfollow ONLY those that refuse to follow back"
                      }
                    >
                      {" "}
                      View Tweets
                    </p>
                  }
                </Grid>
              }
              {
                <Grid item xs={6} className="mobilePadding">
                  <div
                    style={twitter_icon_index}
                    id="icon-box-twitter"
                    onClick={() => {
                      this.push("/gain-followers");
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
                        "You Gain Followers by Following a number of accounts, wait for a while and unfollow ONLY those that refuse to follow back"
                      }
                    >
                      {" "}
                      Profile
                    </p>
                  }
                </Grid>
              }
              {
                <Grid item xs={6} className="mobilePadding">
                  <div style={logout_icon_index} id="logout-icon-box">
                    <span
                      onClick={function() {
                        console.log("hre");
                      }}
                    >
                      <i className="fa fa-sign-out-alt fa fa-lg-modification" />
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
                      Logout
                    </p>
                  }
                </Grid>
              }
            </Grid>
          </div>
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

export default withRouter(connect(mapStateToProps)(DashBoard));
