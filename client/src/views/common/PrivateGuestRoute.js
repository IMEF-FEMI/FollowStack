import React from "react";
import { Route } from "react-router-dom";

const PrivateGuestRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => <Component {...props} />} />
);

export default PrivateGuestRoute;
