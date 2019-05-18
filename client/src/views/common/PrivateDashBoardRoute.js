import React from "react";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import dashboardRoutes from "../../dashboardRoutes";

const PrivateDashBoardRoute = ({ auth }) => {

  return (
    <div>
      {dashboardRoutes.map((route, index) => {
        return (
          <Switch key={index + `${Math.random() * 10}`}>
            <Route
              path={
                route.path === "/user"
                  ? `/${auth.userProfile.screen_name}`
                  : route.path
              }
              exact={route.exact}
              render={props =>
                auth.isAuthenticated === true ? (
                  <route.layout {...props}>
                    <route.component {...props} />
                  </route.layout>
                ) : (
                  <Redirect to="/sign-in" />
                )
              }
            />
          </Switch>
        );
      })}
    </div>
  );
};

PrivateDashBoardRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps)(PrivateDashBoardRoute));
