import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

// Externals
import classNames from "classnames";
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";

// Material icons
import {
  DashboardOutlined as DashboardIcon,
  PeopleOutlined as PeopleIcon,
  InfoOutlined as InfoIcon,
  AccountBoxOutlined as AccountBoxIcon,
  Star as StarIcon
} from "@material-ui/icons";

import { connect } from "react-redux";

import SvgIcon from "@material-ui/core/SvgIcon";

// Component styles
import styles from "./styles";

class Sidebar extends Component {
  render() {
    const { classes, className } = this.props;

    const rootClassName = classNames(classes.root, className);
    const MyLink = React.forwardRef((props, ref) => (
      <NavLink innerRef={ref} {...props} />
    ));
    return (
      <nav className={rootClassName}>
        <div className={classes.logoWrapper}>
          <Link className={classes.logoLink} to="/">
            <img
              alt="FollowStack logo"
              className={classes.logoImage}
              src="/images/logos/followstack.png"
            />
          </Link>
        </div>
        <Divider className={classes.logoDivider} />
        <div className={classes.profile}>
          <Link to="/profile">
            <Avatar
              alt={`${this.props.auth.userProfile.name}`}
              className={classes.avatar}
              src={`${this.props.auth.userProfile.photo}`}
            />
          </Link>
          <Typography className={classes.nameText} variant="h6">
            {`${this.props.auth.userProfile.name}`}
          </Typography>
          <Typography className={classes.bioText} variant="caption">
            {`${this.props.auth.userProfile.screen_name}`}
          </Typography>
        </div>
        <Divider className={classes.profileDivider} />
        <List component="div" disablePadding>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={MyLink}
            to="/dashboard"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <DashboardIcon
                style={{
                  color: "rgb(28, 136, 204)"
                }}
              />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Dashboard"
            />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={MyLink}
            to="/gain-followers"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <PeopleIcon style={{ color: "rgb(144, 138, 22)" }} />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Gain Followers"
            />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={MyLink}
            to="/shared-tweets"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <SvgIcon
                style={{
                  color: "rgb(28, 136, 204)"
                }}
              >
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="View Shared Tweets"
            />
          </ListItem>

          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={MyLink}
            to="/profile"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <AccountBoxIcon
                style={{
                  color: "rgb(144, 138, 22)"
                }}
              />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Profile"
            />
          </ListItem>
        </List>
        <Divider className={classes.listDivider} />
        <List component="div" disablePadding>
          <ListItem className={classes.listItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary={`Total Points: ${this.props.auth.points}`}
              style={{
                color:
                  this.props.auth.points >= 100 ? "rgb(23, 191, 99)" : "#ff3366"
              }}
            />
          </ListItem>
          <Divider className={classes.listDivider} />
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={MyLink}
            to="/earn-points"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <StarIcon
                style={{
                  color: "rgb(144, 138, 22)"
                }}
              />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Earn points"
            />
          </ListItem>
        </List>
      </nav>
    );
  }
}

Sidebar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(withStyles(styles)(Sidebar));
