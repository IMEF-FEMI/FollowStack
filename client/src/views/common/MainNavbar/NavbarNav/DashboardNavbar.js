import React from "react";
import classNames from "classnames";
import { Navbar } from "shards-react";

import NavbarNav from "./NavbarNav";

const classes = classNames("main-navbar", "bg-white", "sticky-top");
class DashboardNavbar extends React.Component {
  // const DashboardNavbar = ({ layout, stickyTop, auth }) => {

  render() {
    return (
      <div className={classes}>
        <Navbar
          type="light"
          theme="light"
          className="shadow  align-items-stretch flex-md-nowrap p-0"
        >
          {window.innerWidth > 767 && (
            <div className={"ml-auto"}>
              <NavbarNav />
            </div>
          )}
          {window.innerWidth <= 767 && (
            <div className={"mr-auto"}>
              <NavbarNav />
            </div>
          )}
          {window.innerWidth <= 767 && (
            <div className={"ml-auto"}>
            </div>
          )}
        </Navbar>
      </div>
    );
  }
}

export default DashboardNavbar;
