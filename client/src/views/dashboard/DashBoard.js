import React from "react"; 
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import MainFooter from "../common/AppFooter";

let welcome_user = {
  color: "#FFF",
  fontFamily: "Nunito, sans-serif",
  fontSize: "30px",
  textAlign: "center",
  marginBottom: "3rem",
  maxWidth: "500px",
  marginLeft: "auto",
  marginRight: "auto"
};
let icon_index = {
  display: "block",
  margin: "0 auto",
  position: "relative",
  textAlign: "center",
  overflow: "hidden",
  width: "75px",
  height: "75px",
  fontSize: "50px",
  lineHeight: "150px",
  backgroundColor: "rgb(17, 128, 32)",
  borderRadius: "15px"
};

let category_text = {
  color: "#FFF",
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
  render() {
    const { width } = this.state;
    const isMobile = width <= 575;
    // const bgimage = require("./assets/img/productCurvyLines.png");
    const bgimage = require("./assets/img/green.jpg");
    return (
      <div>
        <div
          style={{
            backgroundImage:  !isMobile && "url(" + bgimage + ")",
            backgroundSize: !isMobile && "cover",
            backgroundRepeat: !isMobile && "repeat",
            backgroundPosition: !isMobile && "top center",
            backgroundColor: "#191512",
            height: "100vh",
            position: "relative"
          }}
        >
        {/* drop thelayout by 30% if not mobile */}
          <div
            style={{ top: isMobile ? "0%" : "30%", position: "absolute" }}
            className="container"
          >
          {/* display Welcome text here if not mobile */}
            {!isMobile && <div className="mb-3 welcome-block">
              <p style={welcome_user}>
                Welcome {this.props.auth.userData.username}
              </p>
            </div>}

            <div className="row" 
            style={{
              backgroundImage: isMobile && "url(" + bgimage + ")",
              backgroundSize:  isMobile && "cover",
              backgroundRepeat: isMobile &&  "repeat",
              backgroundPosition: isMobile &&  "top center"
            }}>
            {isMobile && 
                <div
                  className="col-xs-12 col-sm-6 col-md-6 col-lg-3 mobilePadding"
                >
                {/* display mobile text here if mobile */}
                   <div className="mb-3 welcome-block" style={{paddingTop: "10vh"}}>
              <p style={welcome_user}>
                Welcome {this.props.auth.userData.username}
              </p>
               </div>
                </div>
              }
              {
                <div
                  className="col-xs-12 col-sm-6 col-md-6 col-lg-3 mobilePadding"
                  onClick={function() {
                    console.log("hre");
                  }}
                >
                  <div style={icon_index} id="icon-box">
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
                </div>
              }
              {
                <div
                  className="col-xs-12 col-sm-6 col-md-6 col-lg-3 mobilePadding"
                  onClick={function() {
                    console.log("hre");
                  }}
                >
                  <div style={icon_index} id="icon-box">
                    <span>
                      <i className="fa fa-images fa fa-lg-modification" />
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
                      Gallery
                    </p>
                  }
                </div>
              }
              {
                <div
                  className="col-xs-12 col-sm-6 col-md-6 col-lg-3 mobilePadding"
                  onClick={function() {
                    console.log("hre");
                  }}
                >
                  <div style={icon_index} id="icon-box">
                    <span>
                      <i className="fa fa-user-circle fa fa-lg-modification" />
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
                </div>
              }
              {
                <div
                  className="col-xs-12 col-sm-6 col-md-6 col-lg-3 mobilePadding"
                  onClick={function() {
                    console.log("hre");
                  }}
                >
                  <div style={icon_index} id="icon-box">
                    <span>
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
                </div>
              }
            </div>
          </div>
        </div>

        {isMobile && <div style={{ paddingTop: "50vh" }}>{<MainFooter />}</div>}
        {!isMobile && <div>{<MainFooter />}</div>}
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

export default connect(mapStateToProps)(DashBoard);
