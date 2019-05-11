import React from "react";
import { Link, withRouter } from "react-router-dom";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../../../actions/authActions";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";

class UserActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  handleClose() {
    this.setState({
      visible: false
    });
  }
  logout() {
    this.props.history.push("/sign-in");
    this.props.logoutUser();
  }

  render() {
    return (
      <ClickAwayListener onClickAway={this.handleClose}>
        <NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
          <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
            <img
              className="user-avatar rounded-circle mr-2"
              src={this.props.userData.userData.photo}
              alt="User Avatar"
            />
          </DropdownToggle>
          <Collapse tag={DropdownMenu} right small open={this.state.visible}>
            <DropdownItem tag={Link} to="user-profile">
              <i className="material-icons">&#xE7FD;</i> Profile
            </DropdownItem>
            <DropdownItem className="text-danger" onClick={this.logout}>
              <i className="material-icons text-danger">&#xE879;</i> Logout
            </DropdownItem>
          </Collapse>
        </NavItem>
      </ClickAwayListener>
    );
  }
}

UserActions.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.userData
});

export default withRouter(
  connect(
    mapStateToProps,
    { logoutUser }
  )(UserActions)
);
