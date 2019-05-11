import React from "react";
import classNames from "classnames";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";

import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Collapse
} from "shards-react";

const classes = classNames(
  "sticky-top",
  "align-items-stretch",
  "flex-md-nowrap"
);

export default class GuestNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);

    this.state = {
      dropdownOpen: false,
      collapseOpen: false
    };
  }

  toggleDropdown() {
    this.setState({
      ...this.state,
      ...{
        dropdownOpen: !this.state.dropdownOpen
      }
    });
  }

  toggleNavbar() {
    this.setState({
      ...this.state,
      ...{
        collapseOpen: !this.state.collapseOpen
      }
    });
  }

  render() {
    return (
      <Navbar
        type="dark"
        theme="dark"
        expand="md"
        className={`${classes}  align-items-stretch flex-md-nowrap p-2`}
      >
        <NavbarBrand
          href="/"
          className="font-weight-bold"
          style={{
            fontSize: 16
          }}
        >
          FollowStack
        </NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar} />

        <Collapse open={this.state.collapseOpen} navbar>
          <Nav navbar className="ml-auto">
            <div className="d-flex justify-content-around">
              <NavItem>
                <Link
                  component={RouterLink}
                  color="inherit"
                  variant="h6"
                  underline="none"
                  className={`btn btn-outline-danger btn-sm mr-2`}
                  to="/sign-in"
                  style={{
                    width: 100,
                    fontSize: 16,
                    color: "white"
                  }}
                >
                  {"Sign In"}
                </Link>
              </NavItem>
              <NavItem>
                <Link
                  component={RouterLink}
                  color="inherit"
                  underline="none"
                  to="/sign-up"
                  variant="h6"
                  className={` btn btn-danger btn-sm`}
                  // className="btn btn-outline-danger btn-sm mr-2"
                  style={{
                    width: 100,
                    fontSize: 16,
                    color: "white"
                  }}
                >
                  {"Sign Up"}
                </Link>
              </NavItem>
            </div>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
