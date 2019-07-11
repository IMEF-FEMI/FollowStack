import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// import dashboardRoutes from "../../dashboardRoutes";
// import NotFound from "../guestpages/404/NotFound";

const PrivateDashBoardRoute = ({ rest, auth, path, Layout, Component }) => {
  return (
    <Route
      {...rest}
      render={props =>
        auth.isAuthenticated === true ? (
          <Layout {...props}>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect to="/sign-in" />
        )
      }
    />
  );
};

PrivateDashBoardRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps)(PrivateDashBoardRoute));
