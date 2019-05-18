import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { SET_USER_DATA, SET_USER_PROFILE } from "./actions/types";
import { setUserProfile } from "./actions/authActions";
import { Provider } from "react-redux";
import axios from "axios";
import store from "./store";
import LandingPage from "./views/guestpages/LandingPage";
import SignUp from "./views/guestpages/SignUp";
import SignIn from "./views/guestpages/SignIn";
import CompleteRegistration from "./views/guestpages/CompleteRegistration";
// import Privacy from "./views/guestpages/Privacy";
import Terms from "./views/guestpages/Terms";
import LaunchScreen from "./views/dashboard/mainAppPages/components/loaders/LaunchScreen";

import PrivateGuestRoute from "./views/common/PrivateGuestRoute";
import PrivateDashBoardRoute from "./views/common/PrivateDashBoardRoute";
import {  ToastContainer } from "react-toastify";
import { Redirect } from "react-router-dom";


import "./assets/styles/custom.css";
import "react-toastify/dist/ReactToastify.css";

// localStorage.clear();
// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  store.dispatch({
    type: SET_USER_DATA,
    payload: JSON.parse(localStorage.getItem("userData"))
  });

  store.dispatch({
    type: SET_USER_PROFILE,
    payload: JSON.parse(localStorage.getItem("userProfile"))
  });
store.dispatch(setUserProfile(store.getState().auth.userData))
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    // window.location.href = "/sign-in";
    // <Redirect to="/sign-in"/>
  }
}

class App extends Component {
  state = {
    serverWoke: false
  };
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  async componentDidMount() {
    try {
      const auth = axios.create();
      auth.defaults.timeout = 5000;
      const { res } = await auth.get("/wake-up");
      this.setState({
        serverWoke: true
      });
      console.log(!!res);
    } catch (e) {
      this.setState({
        serverWoke: true
      });
      console.log(e);
    }
    if (store.getState().auth.isAuthenticated === true) {
      // update profile every 10 mins
      this.timer = setInterval(this.updatePrifile, 10 * 60 * 1000);
    }
  }

  updatePrifile = () => {
    if (store.getState().auth.isAuthenticated === false) {
      return;
    }
store.dispatch(setUserProfile(store.getState().auth.userData))
    
  };

  render() {
    const loggedIn = store.getState().auth.isAuthenticated === true;
    return (
      <Provider store={store}>
        <Router>
          <div>
            <ToastContainer />
            {/* <Route exact path="/" component={LandingPage} /> */}
            <Switch>
              {this.state.serverWoke === false ? (
                <LaunchScreen />
              ) : (
                <Route
                  exact
                  path="/"
                  render={() =>
                    loggedIn === true ? (
                      <Redirect to="/dashboard" />
                    ) : (
                      <LandingPage />
                    )
                  }
                />
              )}
              <PrivateGuestRoute exact path="/sign-up" component={SignUp} />

              <PrivateGuestRoute
                exact
                path="/complete-signup"
                component={CompleteRegistration}
              />
              <Route exact path="/sign-in" component={SignIn} />
              {/* <Route exact path="/privacy" component={Privacy} /> */}
              <Route exact path="/terms" component={Terms} />
              <PrivateDashBoardRoute />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
