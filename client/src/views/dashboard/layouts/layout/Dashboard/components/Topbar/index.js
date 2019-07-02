import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";

// Externals
import classNames from "classnames";
import compose from "recompose/compose";
import PropTypes from "prop-types";

// Material helpers
import withStyles  from "@material-ui/core/styles/withStyles";

// Material components
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

// Material icons
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";

import { connect } from "react-redux";
import { logoutUser } from "../../../../../../../actions/authActions";
import { markAllAsReadAction } from "../../../../../../../actions/notificationAction";

// Shared services
import { getNotifications } from "./services/notification";

// Custom components
import { NotificationList } from "./components";

// Component styles
import styles from "./styles";

//sockets
import { SocketContext } from "../../../../../../../components/SocketContext";

class Topbar extends Component {
  signal = true;

  state = {
    notifications: [],
    notificationsLimit: 4,
    notificationsCount: 0,
    notificationsEl: null
  };

  async getNotifications() {
    try {
      const { notificationsLimit } = this.state;

      const { notifications, notificationsCount } = await getNotifications(
        notificationsLimit
      );

      if (this.signal) {
        this.setState({
          notifications,
          notificationsCount
        });
      }
    } catch (error) {
      return;
    }
  }

  componentDidMount() {
    this.signal = true;
    this.getNotifications();
  }

  componentWillUnmount() {
    this.signal = false;
  }

  handleSignOut = () => {
    const { history, logoutUser, socket } = this.props;

    history.push("/sign-in");
    logoutUser();
    socket.emit("disconnect");
  };

  handleShowNotifications = event => {
    this.getNotifications();
    this.setState({
      notificationsEl: event.currentTarget
    });
    this.props.markAllAsReadAction(this.props.socket, this.props.auth.user.userid)
  };

  handleCloseNotifications = () => {
    this.setState({
      notificationsEl: null
    });
  };

  render() {
    const {
      classes,
      className,
      title,
      isSidebarOpen,
      onToggleSidebar,
    } = this.props;
    const { notifications,  notificationsEl } = this.state;
    const rootClassName = classNames(classes.root, className);
    const showNotifications = Boolean(notificationsEl);

    return (
      <Fragment>
        <div className={rootClassName}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              className={classes.menuButton}
              onClick={onToggleSidebar}
              variant="text"
            >
              {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Typography className={classes.title} variant="h4">
              {title}
            </Typography>
            <IconButton
              className={classes.notificationsButton}
              onClick={this.handleShowNotifications}
            >
              <Badge
                badgeContent={
                  this.props.notifications.unreadCount >0? this.props.notifications.unreadCount : null
                }
                color="secondary"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              className={classes.signOutButton}
              onClick={this.handleSignOut}
            >
              <InputIcon />
            </IconButton>
          </Toolbar>
        </div>
        <Popover
          anchorEl={notificationsEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          onClose={this.handleCloseNotifications}
          open={showNotifications}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <NotificationList
            notifications={notifications}
            onSelect={this.handleCloseNotifications}
          />
        </Popover>
      </Fragment>
    );
  }
}

Topbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isSidebarOpen: PropTypes.bool,
  onToggleSidebar: PropTypes.func,
  title: PropTypes.string
};

Topbar.defaultProps = {
  onToggleSidebar: () => {}
};

const TopbarWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <Topbar {...props} socket={socket} />}
  </SocketContext.Consumer>
);
const mapStateToProps = state => ({
  auth: state.auth,
  notifications: state.notifications,
});
export default connect(
  mapStateToProps,
  { logoutUser , markAllAsReadAction}
)(
  compose(
    withRouter,
    withStyles(styles)
  )(TopbarWithSocket)
);
