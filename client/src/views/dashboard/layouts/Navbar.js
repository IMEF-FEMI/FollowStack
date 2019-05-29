import React, { Component } from "react";

import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import Stars from "@material-ui/icons/Stars";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from "@material-ui/core/IconButton";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { logoutUser } from "../../../actions/authActions";

class Navbar extends Component {
  state = {
    auth: true,
    anchorEl: null
  };

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  logout = () => {
    this.setState({ anchorEl: null });
    this.props.history.push("/sign-in");
    this.props.logoutUser();
  };

  openProfile = () => {
    this.setState({ anchorEl: null });
    this.props.history.push("/user-profile");
  };
  render() {
    var { open, classes, handleDrawerOpen } = this.props;
    const { anchorEl } = this.state;
    const opened = Boolean(anchorEl);

    return (
      <AppBar
        position="fixed"
        color="default"
        className={classNames(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar disableGutters={!open}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={classNames(
              classes.menuButton,
              open && classes.menuButtonHidden,
              window.innerWidth >= 500 && classes.toolbar
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            FollowStack
          </Typography>

          <div
            style={{
              marginLeft: "auto"
            }}
          >
            <IconButton color="inherit">
              <Badge badgeContent={50} color="primary">
                <Stars />
              </Badge>
            </IconButton>

            <IconButton
              color="inherit"
              style={{ padding: 4 }}
              aria-owns={open ? "menu-appbar" : undefined}
              aria-haspopup="true"
              onClick={this.handleMenu}
            >
              <Avatar
                className={classes.avatar}
                src={this.props.auth.userData.photo}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={opened}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.openProfile}>
              <ListItemIcon className={classes.icon}>
                  <AccountCircle/>
                </ListItemIcon>
                <ListItemText
                  inset
                  primary="My Profile"
                />
             </MenuItem>
              <MenuItem onClick={this.logout}>
                <ListItemIcon className={classes.icon}>
                  <PowerSettingsNew />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary="Logout"
                />
                
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(
  connect(
    mapStateToProps,
    { logoutUser }
  )(Navbar)
);
