import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { SET_USER_DATA, SET_USER_PROFILE } from "./actions/types";
import { checkFollowedBackInterval } from "./actions/gainFollowersAction";
import { Provider } from "react-redux";
import store from "./store";
import LandingPage from "./views/guestpages/LandingPage";
import SignUp from "./views/guestpages/SignUp";
import SignIn from "./views/guestpages/SignIn";
import CompleteRegistration from "./views/guestpages/CompleteRegistration";
// import Privacy from "./views/guestpages/Privacy";
import Terms from "./views/guestpages/Terms";

import PrivateGuestRoute from "./views/common/PrivateGuestRoute";
import PrivateDashBoardRoute from "./views/common/PrivateDashBoardRoute";
import { toast, ToastContainer } from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "./assets/styles/shards-dashboards.1.1.0.min.css";
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
  console.log(JSON.parse(localStorage.getItem("userProfile")));

  store.dispatch({
    type: SET_USER_PROFILE,
    payload: JSON.parse(localStorage.getItem("userProfile"))
  });
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "/sign-in";
  }
}

class App extends Component {
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidMount() {
    if (store.getState().auth.isAuthenticated === true) {
      // check for new follow backs every 10 mins
      this.timer = setInterval(this.checkNewFollowBack, 10 * 60 * 1000);
    }
  }

  checkNewFollowBack = () => {
    if (store.getState().auth.isAuthenticated === false) {
      return;
    }
    console.log("checking for new follow backs");

    const oldList = store.getState().gainFollowers.followedBack;

    store.dispatch(checkFollowedBackInterval(store.getState().auth.userData));
    setTimeout(() => {
      const newList = store.getState().gainFollowers.followedBack;
      console.log(oldList.length, newList.length);

      var newFollowers = null;
      // checkk for new items
      if (oldList.length !== newList.length) {
        newFollowers = newList.slice(oldList.length, newList.length);
        newFollowers.forEach(user => {
          toast(`${user.screen_name} has Followed you back!`, {
            position: "bottom-right",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false
          });
        });
      }
    }, 15000);
  };

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route exact path="/" component={LandingPage} />
            <ToastContainer />
            <Switch>
              <PrivateGuestRoute exact path="/sign-up" component={SignUp} />
            </Switch>
            <Switch>
              <PrivateGuestRoute
                exact
                path="/complete-signup"
                component={CompleteRegistration}
              />
            </Switch>
            <Route exact path="/sign-in" component={SignIn} />
            {/* <Route exact path="/privacy" component={Privacy} /> */}
            <Route exact path="/terms" component={Terms} />
            <PrivateDashBoardRoute />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
