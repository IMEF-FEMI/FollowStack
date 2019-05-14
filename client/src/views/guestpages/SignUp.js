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

import { toast, ToastContainer } from "react-toastify";


import {
  Alert,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ListGroupItem
} from "shards-react";
// import SignUpOAuth from "../common/SignUpOAuth ";

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
  paddingBottom: "20vh",
  color: "#FFFFFF"
};
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: " AIzaSyDPRnO_g0nrFa0PNI7IynwTdCnRg8nWNJc",
    authDomain: "followstack.firebaseapp.com",
    projectId: "followstack"
  });
}
class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userExists: false,
      user: {},
      width: window.innerWidth
    };
    this.handleUserData = this.handleUserData.bind(this)
  }


  hasWindowSizeChange = () => {
    this.setState({
      width: window.innerWidth
    });
  };
  startTwitterAuth = () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    const isMobile = this.state.width <= 500;
if(isMobile){
  localStorage.setItem("redirected", true);
  firebase.auth().signInWithRedirect(provider);

}else{
  const that = this;
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result){
        var userData = {}
        if (result.credential) {
          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          var token = result.credential.accessToken;
          var secret = result.credential.secret;
          // ...
          userData.accessToken = token
          userData.secret = secret
        }
        // The signed-in user info.
        var user = result.user;
        console.log("User "+JSON.stringify(user))
        if(user !== null){
          userData.userid = user.providerData[0].uid
          userData.username = user.providerData[0].displayName
          userData.photo = user.providerData[0].photoURL
          that.handleUserData(userData)
        }
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;        
        console.log(`error code ${errorCode} message ${errorMessage}`)
        if (
          errorCode === "auth/network-request-failed" ||
          errorCode === "auth/invalid-credential"
        ) {
          // that.setState({networkError: true})
          toast.error(" An Error has occured Try Again!", {
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
    };
  componentWillMount() {

   
    const { width } = this.state;

    const isMobile = width <= 500;

    if(isMobile){
      if(localStorage.getItem("redirected") === "true"){
        this.setState({loading: true})
      }
      const that = this;
      firebase.auth().getRedirectResult().then(function(result) {
        var userData = {}
        if (result.credential) {
          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          var token = result.credential.accessToken;
          var secret = result.credential.secret;
          // ...
          userData.accessToken = token
          userData.secret = secret
        }
        // The signed-in user info.
        var user = result.user;
        if(user !== null){
          userData.userid = user.providerData[0].uid
          userData.username = user.providerData[0].displayName
          userData.photo = user.providerData[0].photoURL
          // console.log("we here"+JSON.stringify(userData))
          that.handleUserData(userData)
        }else if(user === null || result.credential === undefined){
          that.setState({loading:false})
          localStorage.setItem("redirected", false)
        }
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(`error code ${errorCode} message ${errorMessage}`)
        
        toast.error(" An Error has occured Try Again!", {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
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
    this.setState({
      user: userData,
      loading: true
    }, ()=>{
      this.completeReg(userData);
    });
  };

  async completeReg(userData) {
    const res = await checkUser(userData.userid)
    if(res.data === true){
        this.setState({ loading: false });

        this.setState({ userExists: true });

        toast.error(" ⚠️ User Already Registered! 👨", {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
    }else{
      this.props.history.push({
              pathname: "/complete-signup",
              state: {
                user: this.state.user
              }
            });
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
                    Sign Up
                  </Typography>
                  <Typography variant="body2" align="center">
                    <Link
                      to="/sign-in"
                      underline="always"
                    >
                      Already have an account?
                    </Link>
                  </Typography>
                </React.Fragment>
              </CardHeader>
              <CardBody>
                {!this.state.loading && <TwitterLoginButton
                  onClick={this.startTwitterAuth}
                >
                  <p
                    className="text-center"
                    style={{ marginTop: 1, marginBottom: 1 }}
                  >
                    Sign Up with Twitter
                  </p>
                </TwitterLoginButton>}
                {this.state.loading && <Spinner />}
                
                {this.state.userExists && (
                  <Alert theme="danger" className="text-center">
                    Error User is Already Registered - <br />
                    <Link className="alert-link" to="sign-in">
                      Click to Sign In
                    </Link>
                  </Alert>
                )}
              </CardBody>
              <CardFooter className="border-top">
                <ListGroupItem className="d-flex px-3 border-0">
                  <span className="text-dark text-center">
                    by clicking the sign up button, you agree to our
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

SignUp.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps)(SignUp));
