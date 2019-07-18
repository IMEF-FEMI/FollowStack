

import React, { Component } from "react";
import { Dashboard as DashboardLayout } from "./layout";
import {initGA, trackPage} from '../../../components/Tracking';
import {withRouter} from 'react-router-dom'


class Default extends Component {
  componentDidMount(){
    const page = this.props.location.pathname + this.props.location.search;
    initGA()
    trackPage(page)
  }
  render() {
    return (
      <DashboardLayout>
        {this.props.children}
      </DashboardLayout>
    );
  }
}
export default withRouter(Default);
