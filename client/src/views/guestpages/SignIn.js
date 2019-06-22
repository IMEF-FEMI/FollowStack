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
import { initGA, trackPage } from "../../components/Tracking";
import {
  onSnackbarOpen,
  setSnackbarMessage,
  setSnackbarVariant
} from "../../actions/snackbarAction";

import {
  signIn,
  setUserData,
  setUserProfile,
  setKeyInUse
} from "../../actions/authActions";

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
      user: {},
      width: window.innerWidth,
      
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
        .then(async function(result) {
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
            await that.props.setUserProfile(
              userData,
              localStorage.getItem("keyInUse")
            );
            // console.log("user from the base" + JSON.stringify(userData));

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.setUserData(this.state.user);
      this.props.history.push("/dashboard");
    }
  }
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
        .then(async function(result) {
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
            await that.props.setUserProfile(
              userData,
              localStorage.getItem("keyInUse")
            );
            // console.log("user from the base" + JSON.stringify(userData));
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
          that.notify("Connnectio Error Try Again!", "error");
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
    try {
      const res = await checkUser(userData.userid);
      if (res.data === false) {
        this.setState({ loading: false });

        this.notify(" ⚠️ User Not Registered! 👨", "error");
      } else {
        try {
          //sign in
          this.props.signIn(userData);
        } catch (err) {
          this.setState({ loading: false });

          this.notify("Error Connecting to Server Try again", "error");
        }
      }
    } catch (err) {
      this.setState({ loading: false });
      this.notify("Error Connecting to Server Try again", "error");
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
                  Sign In
                </Typography>
                <Typography variant="body2" align="center">
                  <Link to="/sign-up" underline="always" >
                    Dont have an account?
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
                        Sign In with Twitter
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
                <Typography align="center" >
                  by clicking the sign in button, you agree to our
                  <Link to="/terms" >Terms of service </Link>and 
                  <Link to="/privacy" > Privacy Policy</Link>
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
  setUserData: PropTypes.func.isRequired,
  setUserProfile: PropTypes.func.isRequired,
  setKeyInUse: PropTypes.func.isRequired
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
        setUserProfile,
        setKeyInUse,onSnackbarOpen,
        setSnackbarMessage,
        setSnackbarVariant
      }
    )(SignIn)
  )
);
