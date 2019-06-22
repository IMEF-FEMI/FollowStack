import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Provider } from "react-redux";
import axios from "axios";
import store from "./store";
import LandingPage from "./views/guestpages/LandingPage";
import SignUp from "./views/guestpages/SignUp";
import SignIn from "./views/guestpages/SignIn";
import NotFound from "./views/guestpages/404/NotFound";
import CompleteRegistration from "./views/guestpages/CompleteRegistration";
import Privacy from "./views/guestpages/Privacy";
import Terms from "./views/guestpages/Terms";
import LaunchScreen from "./views/dashboard/mainAppPages/components/loaders/LaunchScreen";

import theme from "./theme";
import { ThemeProvider } from "@material-ui/styles";

import PrivateGuestRoute from "./views/common/PrivateGuestRoute";
import PrivateDashBoardRoute from "./views/common/PrivateDashBoardRoute";
import dashboardRoutes from "./dashboardRoutes";


import { Redirect } from "react-router-dom";
import "./assets/styles/custom.css";

// initialize app settings and socket
import socketIO from "socket.io-client";
import { SocketContext } from "./components/SocketContext";
import { initApp } from "./components/Init";
import { CustomSnackbar } from "./components/CustomSnackbar/index";

const socket = socketIO("http://localhost:8080");

// initialize initial app settings
// includes user profile, points etc.
initApp(socket);

class App extends Component {
  state = {
    serverWoke: false
  };

  async componentDidMount() {
    try {
      const auth = axios.create();
      auth.defaults.timeout = 5000;
      await auth.get("/wake-up");
      this.setState({
        serverWoke: true
      });
    } catch (e) {
      this.setState({
        serverWoke: true
      });
      console.log(e);
    }
  }

  render() {
    var loggedIn = store.getState().auth.isAuthenticated === true;
    
    return (
      <Provider store={store}>
        <SocketContext.Provider value={socket}>
          <div>
            <CustomSnackbar/>
          </div>
          <ThemeProvider theme={theme}>
            <Router>
              <div>
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
              </div>
            </Router>
          </ThemeProvider>
        </SocketContext.Provider>
      </Provider>
    );
  }
}

export default App;
