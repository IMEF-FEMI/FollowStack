

import React, { Component } from "react";
import { Dashboard as DashboardLayout } from "./layouts";

class Default extends Component {
  render() {
    // console.log(JSON.stringify(this.props.children.state.displayName));
    return (
      <DashboardLayout
        title={`${this.props.location.pathname
          .replace(/\//g, "")
          .replace("-", " ")
          .toUpperCase()}`}
      >
        {this.props.children}
      </DashboardLayout>
    );
  }
}
export default Default;
