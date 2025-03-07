import React from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Typography from "./modules/components/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import { withRouter, Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import {ClapSpinner}  from "react-spinners-kit";
import AppFooter from "../guestpages/modules/views/AppFooter";
import AppAppBar from "../guestpages/modules/views/AppAppBar";
import { connect } from "react-redux";
import { TwitterLoginButton } from "react-social-login-buttons";
import axios from 'axios'

import { initGA, trackPage } from "../../components/Tracking";
import {
  enqueueSnackbar,
      closeSnackbar,
} from "../../actions/notistackActions";

import {
  signIn,
  setUserData,
} from "../../actions/authActions";
import { SocketContext } from "../../components/SocketContext";

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
      width: window.innerWidth
    };
  }
  notify = (message, variant) => {
    this.props.enqueueSnackbar({
      message: message,
      options: {
        key: new Date().getTime() + Math.random(),
        variant: variant,
        action: key => (
          <Button
            style={{ color: "#fff" }}
            onClick={() => closeSnackbar(key)}
          >
            dismiss
          </Button>
        )
      }
    });
  };
  hasWindowSizeChange = () => {
    this.setState({
      width: window.innerWidth
    });
  };

startTwitterAuth = () =>{
      this.setState({loading: true})

  axios.get(`/auth/twitter/connect/${localStorage.getItem("keyInUse")}`).then(res=>{
    if (res.data.redirectUrl) {
      this.setState({loading: true})
      localStorage.setItem("oauthRequestTokenSecret", res.data.oauthRequestTokenSecret)
      localStorage.setItem("oauthRequestToken", res.data.oauthRequestToken)
      window.location.href= res.data.redirectUrl
    }
  })
}
 componentDidMount (){
  if(this.props.location.state){
    this.notify(this.props.location.state.error, "error")
  }
}
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.setUserData(this.state.user);
      this.props.history.push("/shared-tweets");
    }
  }
  componentWillMount() {
    // TrackPage
    const page = this.props.location.pathname + this.props.location.search;
    initGA();
    trackPage(page);


    // size change listener
    window.addEventListener("resize", this.hasWindowSizeChange);


    if (this.props.auth.isAuthenticated === true) {
      this.props.history.push("/shared-tweets");
    }
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.hasWindowSizeChange);
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
                  <Link to="/sign-up" underline="always">
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
                {this.state.loading &&
             (<Grid container justify="center" style={{marginTop: "65px", marginBottom: "65px"}}>
                   <ClapSpinner
                     size={70}
                     color="#686769"
                     loading={true}/> 
                     </Grid>)}
              </React.Fragment>
              <Divider
                variant="fullWidth"
                style={{
                  width: "100%"
                }}
              />

              <React.Fragment>
                <Typography align="center">
                  by clicking the sign in button, you agree to our
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
  setUserData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth
});

const SignInWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <SignIn {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      {
        signIn,
        setUserData,
        enqueueSnackbar,
      closeSnackbar
      }
    )(SignInWithSocket)
  )
);
