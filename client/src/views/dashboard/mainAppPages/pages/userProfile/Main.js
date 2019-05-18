import React, { Component } from "react";
import atoms from "../../components/atoms";
import theme from "../../theme/instapaper/theme";
import withTheme from "./withTheme";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import MainPageLoader from "../../components/loaders/MainPageLoader";

import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  beginUnFollowAction,
  gainFollowersAction,
  checkTotalGainedAction
} from "../../../../../actions/gainFollowersAction";
const { Avatar, Typography } = atoms;

class Main extends Component {
  constructor() {
    super();

    this.state = {
      context: "profile",
      searchTerms: null,
      page: 0,
      pages: [],
      initialFetch: true,
      isFetching: false,
      hasMore: true,
      switchingContext: false,
      showNavToTop: false
    };
    // this.onScroll = onScroll.call(this, this.fetchNextPage);
    this.signal = axios.CancelToken.source();
    this.topRef = React.createRef();
  }
  componentDidMount() {
    this.props.checkTotalGainedAction(this.props.auth.user.userid);

    console.log("gain followers main mounted");
  }
  render() {
    const upSm = window.innerWidth >= 600;
    const { totalGained } = this.props.gainFollowers;
    const { userProfile } = this.props.auth;

    return (
      <React.Fragment>
        <CssBaseline />
        <Box mb="44px">
          <Grid
            container
            style={{
              paddingTop: "80px"
            }}
          >
            <Grid item xs={4}>
              <Avatar
                ultraLarge={upSm}
                medium={!upSm}
                style={{ margin: "auto" }}
                src={userProfile.photo}
              />
            </Grid>
            <Grid item xs={8}>
              <Grid container alignItems="center">
                <Typography variant="subtitle1" bold>
                  {userProfile.name}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">
                  {userProfile.screen_name}
                </Typography>
              </Grid>
              <Box mb="20px">
                <Grid container spacing={40}>
                  <Grid item>
                    <Typography variant="subtitle1">
                      <b>{userProfile.followers}</b> followers
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1">
                      <b>{userProfile.following}</b> following
                    </Typography>
                  </Grid>
                  <Grid item>
                    {totalGained !== 0 && (
                      <Typography variant="subtitle1">
                        <b> {`${totalGained} `}</b>Followers Gained
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
              <Typography variant="subtitle1">
                {userProfile.description}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <div ref={this.topRef}>
          {(this.state.initialFetch || this.state.switchingContext) && (
            <MainPageLoader />
          )}
        </div>
      </React.Fragment>
    );
  }
}

Main.propTypes = {
  beginUnFollowAction: PropTypes.func.isRequired,
  gainFollowersAction: PropTypes.func.isRequired,
  gainFollowers: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  gainFollowers: state.gainFollowers
});
export default connect(
  mapStateToProps,
  {
    beginUnFollowAction,
    gainFollowersAction,
    checkTotalGainedAction
  }
)(withTheme(theme)(Main));
