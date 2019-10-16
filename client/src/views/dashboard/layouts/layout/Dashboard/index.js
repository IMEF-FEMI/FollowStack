import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
// Externals
import classNames from "classnames";
import compose from "recompose/compose";
import PropTypes from "prop-types";

// Material helpers
import withStyles from "@material-ui/core/styles/withStyles";
import withWidth from "@material-ui/core/withWidth";

// Material components
import Drawer from "@material-ui/core/Drawer";

// Custom components
import { Sidebar, Topbar } from "./components";
import { openDrawer, closeDrawer } from "../../../../../actions/drawerActions";

// Component styles
import styles from "./styles";

class Dashboard extends Component {
  handleClose = () => {
    if(window.innerWidth >= 1280) return
    // this.setState({ isOpen: false });
    this.props.closeDrawer();

  };

  handleToggleOpen = () => {
    // this.setState(prevState => ({
    //   isOpen: !prevState.isOpen
    // }));
    this.props.openDrawer();
  };

  render() {
    const { classes, width, title, children } = this.props;
    const { isOpen } = this.props.drawer;

    const isMobile = ["xs", "sm", "md"].includes(width);
    const shiftTopbar = isOpen && !isMobile;
    const shiftContent = isOpen && !isMobile;

    return (
      <Fragment>
        <Topbar
          className={classNames(classes.topbar, {
            [classes.topbarShift]: shiftTopbar
          })}
          isSidebarOpen={isOpen}
          onToggleSidebar={this.handleToggleOpen}
          title={title}
        />
        <Drawer
          anchor="left"
          classes={{ paper: classes.drawerPaper }}
          onClose={this.handleClose}
          open={isOpen}
          variant={isMobile ? "temporary" : "persistent"}
        >
          <Sidebar className={classes.sidebar} handleClose={this.handleClose}/>
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: shiftContent
          })}
        >
          {children}
        </main>
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  width: PropTypes.string.isRequired
};
const mapStateToProps = state => ({
  drawer: state.drawer
});

export default compose(
  connect(
    mapStateToProps,
    { openDrawer, closeDrawer }
  ),
  withStyles(styles),
  withWidth()
)(Dashboard);
