

import React, { Component } from "react";
import { Dashboard as DashboardLayout } from "./layout";
import {initGA, trackPage} from '../../../components/Tracking';


class Default extends Component {
  componentDidMount(){
    const page = this.props.location.pathname + this.props.location.search;
    initGA()
    trackPage(page)
  }
  render() {
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
