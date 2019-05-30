import React, { Component } from "react";

import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
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
  formatCount(count) {
    const readablize = num => {
      var e = Math.floor(Math.log(num) / Math.log(1000));
      return (num / Math.pow(1000, e)).toFixed(1) + "K";
    };

    if (count > 999) return readablize(count);
    else return count;
  }
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
              <Badge
                badgeContent={this.formatCount(this.props.auth.points)}
                color={this.props.auth.points >= 50 ? "primary" : "secondary"}
              >
                <SvgIcon>
                  <path
                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </SvgIcon>
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
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText inset primary="My Profile" />
              </MenuItem>
              <MenuItem onClick={this.logout}>
                <ListItemIcon className={classes.icon}>
                  <PowerSettingsNew />
                </ListItemIcon>
                <ListItemText inset primary="Logout" />
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
