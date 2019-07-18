import React, { Component, Fragment } from "react";
import {withRouter} from 'react-router-dom'
// Externals
import classNames from "classnames";
import {compose} from "redux";
import PropTypes from "prop-types";

// Material helpers
import withStyles  from "@material-ui/core/styles/withStyles";

// Material components
import IconButton from "@material-ui/core/IconButton";
import PeaButton from "../../../../../mainAppPages/components/profile/PeaButton"

import Toolbar from "@material-ui/core/Toolbar";

// Material icons
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import InputIcon from "@material-ui/icons/Input";

import { connect } from "react-redux";
import { logoutUser } from "../../../../../../../actions/authActions";
import {refreshOnlineAction} from "../../../../../../../actions/usersAction"
import {refreshTweetsAction} from "../../../../../../../actions/viewTweetsAction"
import {refreshProfileAction} from "../../../../../../../actions/myProfileActions"

// Component styles
import styles from "./styles";

//sockets
import { SocketContext } from "../../../../../../../components/SocketContext";

class Topbar extends Component {
  signal = true;

  state = {
    loading: false
  };


  componentDidMount() {
    this.signal = true;
  }

  componentWillUnmount() {
    this.signal = false;
  }

  handleSignOut = () => {
    const {  logoutUser, socket } = this.props;
    logoutUser();
    socket.emit("disconnect");
  };

  handleRefresh = ()=>{
    const {refreshProfileAction, refreshTweetsAction, refreshOnlineAction} = this.props
    this.setState({loading: true})

    const location = this.props.location.pathname

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
    const {  loading } = this.state;
    const rootClassName = classNames(classes.root, className);

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
              className={classNames(classes.signOutButton)}
              onClick={this.handleSignOut}
            >
              <InputIcon />
            </IconButton>
          </Toolbar>
        </div>
      </Fragment>
    );
  }
}

Topbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
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
});
export default 
  compose(
  connect( mapStateToProps,
  { logoutUser, refreshOnlineAction, refreshTweetsAction, refreshProfileAction}),
    withStyles(styles),
    withRouter
  )(TopbarWithSocket)

