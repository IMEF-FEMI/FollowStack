import React from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Typography from "./modules/components/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

import firebase from "firebase/app";
import "firebase/auth";
import { withRouter, Link } from "react-router-dom";
import AppFooter from "../guestpages/modules/views/AppFooter";
import AppAppBar from "../guestpages/modules/views/AppAppBar";
import Spinner from "./modules/views/completeregSubview/Spinner";
import { connect } from "react-redux";
import { TwitterLoginButton } from "react-social-login-buttons";

import { checkUser } from "../../async/auth";
import { signIn, setUserData } from "../../actions/authActions";
import { getUserProfile } from "../../async/auth";
import { initGA, trackPage } from "../../components/Tracking";
import {
  onSnackbarOpen,
  setSnackbarMessage,
  setSnackbarVariant
} from "../../actions/snackbarAction";


const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
    borderRadius: "10px"
  }
});

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userExists: false,
      user: {},
      width: window.innerWidth,
      snackbarOpen: false,
      snackbarMessage: "",
      snackbarvariant: "",
      vertical: "bottom",
      horizontal: "right"
    };
    this.handleUserData = this.handleUserData.bind(this);
  }

  notify = (message, variant) => {
    this.props.setSnackbarMessage(message);
    this.props.setSnackbarVariant(variant);
    this.props.onSnackbarOpen();
  };
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
          console.log("User " + JSON.stringify(user));
          if (user !== null) {
            userData.userid = user.providerData[0].uid;
            userData.username = user.providerData[0].displayName;
            userData.photo = user.providerData[0].photoURL;

            that.handleUserData(userData);
          }
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(`error code ${errorCode} message ${errorMessage}`);

          that.notify("Connection Error Try Again!", "error");
        });
    }
  };
  componentWillMount() {
    // TrackPage
    const page = this.props.location.pathname + this.props.location.search;
    initGA();
    trackPage(page);
    const { width } = this.state;

    const isMobile = width <= 500;

    if (isMobile) {
      if (localStorage.getItem("redirected") === "true") {
        this.setState({ loading: true });
      } else {
        return;
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
            // console.log("we here"+JSON.stringify(userData))
            that.handleUserData(userData);
            localStorage.setItem("redirected", false);
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
          that.notify("Connection Error Try Again!", "error");

          localStorage.setItem("redirected", false);
          that.setState({ loading: false });
        });
    }

    // size change listener
    window.addEventListener("resize", this.hasWindowSizeChange);
    if (this.props.auth.isAuthenticated === true) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.hasWindowSizeChange);
  }
  async handleUserData(userData) {
    const res = await getUserProfile(
      userData,
      localStorage.getItem("keyInUse")
    );
    if (res !== undefined) {
      userData.photo = res.data.photo;
    }
    this.setState(
      {
        user: userData,
        loading: true
      },
      () => {
        this.completeReg(userData);
      }
    );
  }

  async completeReg(userData) {
    const res = await checkUser(userData.userid);
    if (res.data === true) {
      this.setState({ loading: false });

      this.setState({ userExists: true });

      this.notify(" ⚠️ User Already Registered!", "warning");
    } else {
      this.props.history.push({
        pathname: "/complete-signup",
        state: {
          user: this.state.user
        }
      });
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div
        style={{
          backgroundColor: "#2c3e50",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          height: "100%"
        }}
      >
        <AppAppBar />
        <main className={classes.main}>
          <CssBaseline />
          <div
            style={{
              paddingTop: "15vh"
            }}
          >
            <Paper className={classes.paper}>
              <React.Fragment>
                <Typography
                  variant="h3"
                  gutterBottom
                  marked="center"
                  align="center"
                >
                  Sign Up
                </Typography>
                <Typography variant="body2" align="center">
                  <Link to="/sign-in" underline="always">
                    Already have an account?
                  </Link>
                </Typography>
              </React.Fragment>
              <Divider
                variant="fullWidth"
                style={{
                  width: "100%"
                }}
              />
              <React.Fragment>
                {!this.state.loading && (
                  <div
                    style={{
                      paddingTop: "5vh",
                      paddingBottom: "5vh",
                      width: "100%"
                    }}
                  >
                    <TwitterLoginButton onClick={this.startTwitterAuth}>
                      <Typography
                        align="center"
                        style={{ marginTop: 1, marginBottom: 1 }}
                      >
                        Sign Up with Twitter
                      </Typography>
                    </TwitterLoginButton>
                  </div>
                )}
                {this.state.loading && <Spinner />}
              </React.Fragment>
              <Divider
                variant="fullWidth"
                style={{
                  width: "100%"
                }}
              />

              <React.Fragment>
                <Typography align="center">
                  by clicking the sign up button, you agree to our
                  <Link to="/terms">Terms of service </Link>and
                  <Link to="/privacy"> Privacy Policy</Link>
                </Typography>
              </React.Fragment>
            </Paper>
          </div>
        </main>

        <AppFooter />
      </div>
    );
  }
}

SignIn.propTypes = {
  auth: PropTypes.object.isRequired,
  signIn: PropTypes.func.isRequired,
  setUserData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      {
        signIn,
        setUserData,
        onSnackbarOpen,
        setSnackbarMessage,
        setSnackbarVariant
      }
    )(SignIn)
  )
);
