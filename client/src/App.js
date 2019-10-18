import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";
import LandingPage from "./views/guestpages/LandingPage";
import SignUp from "./views/guestpages/SignUp";
import SignIn from "./views/guestpages/SignIn";
import AuthPage from "./views/guestpages/AuthPage";
import NotFound from "./views/guestpages/404/NotFound";
import CompleteRegistration from "./views/guestpages/CompleteRegistration";
import Privacy from "./views/guestpages/Privacy";
import Terms from "./views/guestpages/Terms";

import theme from "./theme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";

import PrivateGuestRoute from "./views/common/PrivateGuestRoute";
import PrivateDashBoardRoute from "./views/common/PrivateDashBoardRoute";
import dashboardRoutes from "./dashboardRoutes";

import { Redirect } from "react-router-dom";
import "./assets/styles/custom.css";

// initialize app settings and socket
import socketIO from "socket.io-client";
import { SocketContext } from "./components/SocketContext";
import { initApp } from "./components/Init";
import Notifier from "./components/CustomSnackbar/Notifier/Notifier";
import { SOCKET_URL } from "./config";
import { SnackbarProvider } from "notistack";

const socket = socketIO(SOCKET_URL);

// initialize initial app settings
// includes user profile, points etc.
initApp(socket);

class App extends Component {
  state = {
    serverWoke: false
  };
 // fake authentication Promise
 authenticate(){
  return new Promise(resolve => setTimeout(resolve, 2000)) // 2 seconds
}

  async componentDidMount() {
    this.authenticate().then(() => {
      const ele = document.getElementById('ipl-progress-indicator')
      if(ele){
        // fade out
        ele.classList.add('available')
        setTimeout(() => {
          // remove from DOM
          ele.outerHTML = ''
        }, 2000)
      }
    })
  }

  render() {
    var loggedIn = store.getState().auth.isAuthenticated === true;

    return (
      <Provider store={store}>
        <SnackbarProvider maxSnack={3} disableWindowBlurListener={true}>
          <SocketContext.Provider value={socket}>
            <div>
              <Notifier />
            </div>
            <ThemeProvider theme={theme}>
              <Router>
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() =>
                      loggedIn === true ? (
                        <Redirect to="/shared-tweets" />
                      ) : (
                        <LandingPage />
                      )
                    }
                  />
                  <PrivateGuestRoute exact path="/sign-up" component={SignUp} />
                  <PrivateGuestRoute
                    exact
                    path="/auth/authorize"
                    component={AuthPage}
                  />
                  <PrivateGuestRoute
                    exact
                    path="/complete-signup"
                    component={CompleteRegistration}
                  />
                  <Route exact path="/sign-in" component={SignIn} />
                  <Route exact path="/privacy" component={Privacy} />
                  <Route exact path="/terms" component={Terms} />
                  {dashboardRoutes.map((route, index) => {
                    return (
                      <PrivateDashBoardRoute
                        key={index + `${Math.random() * 10}`}
                        path={route.path}
                        Layout={route.layout}
                        Component={route.component}
                      />
                    );
                  })}
                  <Route component={NotFound} />
                </Switch>
              </Router>
            </ThemeProvider>
          </SocketContext.Provider>
        </SnackbarProvider>
      </Provider>
    );
  }
}

export default App;
