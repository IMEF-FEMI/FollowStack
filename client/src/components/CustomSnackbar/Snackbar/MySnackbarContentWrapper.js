import React from "react";
import classNames from "classnames";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import IconButton from "@material-ui/core/IconButton";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Avatar from "@material-ui/core/Avatar";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
  followed: Avatar,
  followedback: Avatar,
  followingback: Avatar
};

const styles = theme => ({
  success: {
    backgroundColor: green[600]
  },
  followed: {
    backgroundColor: green[600]
  },
  followedback: {
    backgroundColor: green[600]
  },
  followingback: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing()
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
});

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  var Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon
            src={variant.includes("follow") ? message.photo : undefined}
            className={classNames(classes.icon, classes.iconVariant)}
          />
          {(variant !== "followed" && variant !== "followedback" && variant !== "followingback") && (message)}
          {variant === "followed" && (`${message.screen_name }Just followed you`)}
          {variant === "followedback" && (`${message.screen_name } Just followed you back`)}
          {variant === "followingback" && (` you are now following ${message.screen_name}`)}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(["success", "warning", "error", "info", "followed", "followedback", "followingback"])
    .isRequired
};

export default withStyles(styles)(MySnackbarContent);