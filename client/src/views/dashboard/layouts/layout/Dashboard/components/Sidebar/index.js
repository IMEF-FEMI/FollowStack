import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

// Externals
import classNames from "classnames";
import PropTypes from "prop-types";

// Material helpers
import withStyles from "@material-ui/core/styles/withStyles";

// Material components
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ListSubheader from "@material-ui/core/ListSubheader";
import SvgIcon from "@material-ui/core/SvgIcon";
import Icon from "@material-ui/core/Icon";

// Material icons

import PeopleIcon from "@material-ui/icons/PeopleOutlined";
import AccountBoxIcon from "@material-ui/icons/AccountBoxOutlined";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import { connect } from "react-redux";

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
          <Link
            className={classes.logoLink}
            to="/"
            onClick={this.props.handleClose}
          >
            <img
              alt="FollowStack logo"
              className={classes.logoImage}
              src="/images/logos/followstack.png"
            />
          </Link>
        </div>
        <Divider className={classes.logoDivider} />
        <div className={classes.profile}>
          <Link to="/profile" onClick={this.props.handleClose}>
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
            onClick={this.props.handleClose}
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
              primary="Shared Tweets"
            />
          </ListItem>

          <ListItem
            onClick={this.props.handleClose}
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
              primary="My Wall"
            />
          </ListItem>
          <ListItem
            onClick={this.props.handleClose}
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
            onClick={this.props.handleClose}
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={MyLink}
            to="/buy-points"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <ShoppingCart color="primary" />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Get Extra Points"
            />
          </ListItem>
        </List>
        <Divider className={classes.listDivider} />
        <List
          component="div"
          disablePadding
          subheader={
            <ListSubheader className={classes.listSubheader}>
              Points
            </ListSubheader>
          }
        >
          <ListItem className={classes.listItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <Icon>
                <i
                  className="fas fa-coins"
                  style={{
                    color: "#17bf63"
                  }}
                />{" "}
              </Icon>
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
