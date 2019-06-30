import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

// Externals
import PropTypes from "prop-types";
import classNames from "classnames";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// Material icons
import AddAlert from "@material-ui/icons/AddAlert";
import PersonAdd from "@material-ui/icons/PersonAdd";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import SvgIcon from "@material-ui/core/SvgIcon";
import moment from "moment";
import { connect } from "react-redux";

// Component styles
import styles from "./styles";
import { clearNotificationsAction } from "../../../../../../../../../actions/notificationAction";
import { SocketContext } from "../../../../../../../../../components/SocketContext";

const icons = {
  pointsDeducted: {
    icon: (
      <SvgIcon>
        <path d="M0 0h24v24H0zm0 0h24v24H0z" fill="none" />
        <path d="M4 11v2h8v-2H4zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3v13z" />
      </SvgIcon>
    ),
    color: "blue"
  },
  pointsGained: {
    icon: (
      <SvgIcon>
        <path d="M0 0h24v24H0zm0 0h24v24H0z" fill="none" />
        <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4V7zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3v13z" />
      </SvgIcon>
    ),
    color: "green"
  },
  unsharedTweet: {
    icon: (
      <SvgIcon>
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </SvgIcon>
    ),
    color: "red"
  },
  sharedTweet: {
    icon: (
      <SvgIcon>
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </SvgIcon>
    ),
    color: "green"
  },
  followed: {
    icon: <PersonAdd />,
    color: "green"
  },
  error: {
    icon: <AddAlert />,
    color: "red"
  }
};

class NotificationList extends Component {
  clearNotification = () => {
    // clear notifications on backend too using websockets
    this.props.onSelect();
    this.props.clearNotificationsAction(
      this.props.socket,
      this.props.auth.user.userid
    );
  };
  render() {
    const { className, classes, notifications, onSelect } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        {notifications.length > 0 ? (
          <Fragment>
            <div className={classes.header}>
              <Typography variant="h6">Notifications</Typography>
              <Typography className={classes.subtitle} variant="body2">
                {notifications.length} notifications
              </Typography>
            </div>
            <div className={classes.content}>
              <List component="div">
                {notifications.map(notification => (
                  <Link
                    key={
                      notification.id
                        ? notification.id + `${Math.random() * 4}`
                        : notification._id + `${Math.random() * 4}`
                    }
                    to="#"
                    style={{ textDecoration: "none" }}
                  >
                    <ListItem
                      className={classes.listItem}
                      component="div"
                      onClick={onSelect}
                    >
                      <ListItemIcon
                        className={classes.listItemIcon}
                        style={{
                          color:
                            icons[
                              notification.type
                                ? notification.type
                                : notification.notificationType
                            ].color
                        }}
                      >
                        {
                          icons[
                            notification.type
                              ? notification.type
                              : notification.notificationType
                          ].icon
                        }
                      </ListItemIcon>
                      <ListItemText
                        classes={{ secondary: classes.listItemTextSecondary }}
                        primary={notification.title}
                        secondary={moment(notification.when).fromNow()}
                      />
                      <ArrowForwardIosIcon className={classes.arrowForward} />
                    </ListItem>
                    <Divider />
                  </Link>
                ))}
              </List>
              <div className={classes.footer}>
                <Button
                  color="secondary"
                  component={Link}
                  size="small"
                  to="#"
                  variant="contained"
                  onClick={this.clearNotification}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </Fragment>
        ) : (
          <div className={classes.empty}>
            <div className={classes.emptyImageWrapper}>
              <img
                alt="Empty list"
                className={classes.emptyImage}
                src="/images/empty.png"
              />
            </div>
            <Typography variant="h4">There's nothing here...</Typography>
          </div>
        )}
      </div>
    );
  }
}

NotificationList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired,
  onSelect: PropTypes.func
};

NotificationList.defaultProps = {
  notifications: [],
  onSelect: () => {}
};
const NotificationListWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <NotificationList {...props} socket={socket} />}
  </SocketContext.Consumer>
);
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { clearNotificationsAction }
)(withStyles(styles)(NotificationListWithSocket));
