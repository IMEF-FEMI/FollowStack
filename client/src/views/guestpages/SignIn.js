// --- Post bootstrap -----
import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { withRouter, Link } from "react-router-dom";
import Typography from "./modules/components/Typography";
import AppFooter from "../common/AppFooter";
import NavBar from "../common/NavBar";
import Spinner from "./modules/views/completeregSubview/Spinner";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { TwitterLoginButton } from "react-social-login-buttons";

import { checkUser } from "../../async/auth";
import { signIn, setUserData, setUserProfile } from "../../actions/authActions";

import { toast, ToastContainer } from "react-toastify";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ListGroupItem
} from "shards-react";
// import SignUpOAuth from "../common/SignUpOAuth ";

const conatinerFluid = {
  paddingRight: "15px",
  paddingLeft: "15px",
  marginRight: "auto",
  marginLeft: "auto",
  width: "100%"
};

const container = {
  ...conatinerFluid,
  zIndex: "2",
  position: "relative",
  paddingTop: "20vh",
  paddingBottom: "20vh",
  color: "#FFFFFF"
};

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: " AIzaSyDPRnO_g0nrFa0PNI7IynwTdCnRg8nWNJc",
    authDomain: "followstack.firebaseapp.com"
  });
}

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      width: window.innerWidth
    };
    this.handleUserData = this.handleUserData.bind(this);
  }

  hasWindowSizeChange = () => {
    this.setState({
      width: window.innerWidth
    });
  };
  startTwitterAuth = () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    const isMobile = this.state.width <= 500;
    if (isMobile) {
      localStorage.setItem("redirected", true);
      firebase.auth().signInWithRedirect(provider);
    } else {
      const that = this;
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {
          var userData = {};
          if (result.credential) {
            // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
            // You can use these server side with your app's credentials to access the Twitter API.
            var token = result.credential.accessToken;
            var secret = result.credential.secret;
            // ...
            userData.accessToken = token;
            userData.secret = secret;
          }
          // The signed-in user info.
          var user = result.user;
          if (user !== null) {
            userData.userid = user.providerData[0].uid;
            userData.username = user.providerData[0].displayName;
            userData.photo = user.providerData[0].photoURL;
            that.props.setUserProfile(userData);
            // console.log("user from the base" + JSON.stringify(userData));
            that.handleUserData(userData);
          }
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(`error code ${errorCode} message ${errorMessage}`);
          if (
            errorCode === "auth/network-request-failed" ||
            errorCode === "auth/invalid-credential"
          ) {
            // that.setState({networkError: true})
            toast.error(" ⚠️️ Network Error Try Again!", {
              position: "bottom-right",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
          }
          // ...
        });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.setUserData(this.state.user);
      this.props.history.push("/dashboard");
    }
  }
  componentWillMount() {
    const { width } = this.state;

    const isMobile = width <= 500;

    if (isMobile) {
      if (localStorage.getItem("redirected") === "true") {
        this.setState({ loading: true });
      }
      const that = this;
      firebase
        .auth()
        .getRedirectResult()
        .then(function(result) {
          var userData = {};
          if (result.credential) {
            // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
            // You can use these server side with your app's credentials to access the Twitter API.
            var token = result.credential.accessToken;
            var secret = result.credential.secret;
            // ...
            userData.accessToken = token;
            userData.secret = secret;
          }
          // The signed-in user info.
          var user = result.user;
          if (user !== null) {
            userData.userid = user.providerData[0].uid;
            userData.username = user.providerData[0].displayName;
            userData.photo = user.providerData[0].photoURL;
            that.props.setUserProfile(userData);
            // console.log("user from the base" + JSON.stringify(userData));
            that.handleUserData(userData);
          } else if (user === null || result.credential === undefined) {
            that.setState({ loading: false });
            localStorage.setItem("redirected", false);
          }
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(`error code ${errorCode} message ${errorMessage}`);
          if (
            errorCode === "auth/network-request-failed" ||
            errorCode === "auth/invalid-credential"
          ) {
            // that.setState({networkError: true})
            toast.error(" ⚠️️ Network Error Try Again!", {
              position: "bottom-right",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
          }
        });
    }

    // size change listener
    window.addEventListener("resize", this.hasWindowSizeChange);
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.hasWindowSizeChange);
  }
  handleUserData(userData) {
    this.setState(
      {
        user: userData,
        loading: true,
        networkError: false
      },
      () => {
        this.completeSignIn(userData);
      }
    );
  }

  async completeSignIn(userData) {
    const res = await checkUser(userData.userid);
    if (res.data === false) {
      this.setState({ loading: false });

      toast.error(" ⚠️ User Not Registered! 👨", {
        position: "bottom-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } else {
      //sign in
      this.props.signIn(userData);
    }
  }
  render() {
    const image = require("./assets/img/socialmedia.jpg");
    return (
      <div
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          height: "100%"
        }}
      >
        <NavBar />
        <ToastContainer />
        <div style={container} className="col-sm-6 col-xs-6 col-md-5">
          {
            <Card small>
              <CardHeader className="border-bottom">
                <React.Fragment>
                  <Typography
                    variant="h3"
                    gutterBottom
                    marked="center"
                    align="center"
                  >
                    Sign In
                  </Typography>
                  <Typography variant="body2" align="center">
                    <Link to="/sign-up" underline="always">
                      Dont have an account?
                    </Link>
                  </Typography>
                </React.Fragment>
              </CardHeader>
              <CardBody>
                {!this.state.loading && (
                  <TwitterLoginButton onClick={this.startTwitterAuth}>
                    <p
                      className="text-center"
                      style={{ marginTop: 1, marginBottom: 1 }}
                    >
                      Sign In with Twitter
                    </p>
                  </TwitterLoginButton>
                )}
                {this.state.loading && <Spinner />}
              </CardBody>
              <CardFooter className="border-top">
                <ListGroupItem className="d-flex px-3 border-0">
                  <span className="text-dark text-center">
                    by clicking the sign in button, you agree to our
                    <Link to="/terms">Terms of service </Link>and
                    <Link to="/privacy">Privacy Policy</Link>
                  </span>
                </ListGroupItem>
              </CardFooter>
            </Card>
          }
        </div>
        <AppFooter />
      </div>
    );
  }
}

SignIn.propTypes = {
  auth: PropTypes.object.isRequired,
  signIn: PropTypes.func.isRequired,
  setUserData: PropTypes.func.isRequired,
  setUserProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(
  connect(
    mapStateToProps,
    { signIn, setUserData, setUserProfile }
  )(SignIn)
);
