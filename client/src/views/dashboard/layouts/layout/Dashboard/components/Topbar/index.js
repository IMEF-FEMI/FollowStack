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
import PeaButton from "../../../../../mainAppPages/components/profile/PeaButton"

import Popover from "@material-ui/core/Popover";
import Toolbar from "@material-ui/core/Toolbar";

// Material icons
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";

import { connect } from "react-redux";
import { logoutUser } from "../../../../../../../actions/authActions";
import { markAllAsReadAction } from "../../../../../../../actions/notificationAction";
import {refreshOnlineAction} from "../../../../../../../actions/usersAction"
import {refreshTweetsAction} from "../../../../../../../actions/viewTweetsAction"
import {refreshProfileAction} from "../../../../../../../actions/myProfileActions"

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
    notificationsEl: null,
    loading: false
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
  handleRefresh = ()=>{
    const {refreshProfileAction, refreshTweetsAction, refreshOnlineAction} = this.props
    const location = this.props.location.pathname
    this.setState({loading: true})


    console.log(location)

    setTimeout(()=>{
        switch(location){
            case "/profile":
              refreshProfileAction()
              this.setState({loading: false})
              break;

            case "/shared-tweets":
              refreshTweetsAction();
              this.setState({loading: false})
              break;
            case "/online-users":
              refreshOnlineAction()
              this.setState({loading: false})
              break;
            default:
              this.setState({loading: false})
              break;
    }

    },2000)

  }
  render() {
    const {
      classes,
      className,
      isSidebarOpen,
      onToggleSidebar,
    } = this.props;
    const { notifications,  notificationsEl, loading } = this.state;
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
          
            <PeaButton
              className={classes.refreshButton}
              size={'small'}
              variant={'outlined'}
              labelExpanded={false}
              icon={!loading ? 'refresh': ''}
              iconProps={{
                color: 'default',
                size: 'small',
              }}
              loading={this.state.loading}

              style={{ marginTop: 6 }}
              onClick={this.handleRefresh}
            >
              { "Refresh"}
            </PeaButton>
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
  { logoutUser , markAllAsReadAction, refreshOnlineAction, refreshTweetsAction, refreshProfileAction}
)(
  compose(
    withRouter,
    withStyles(styles)
  )(TopbarWithSocket)
);
