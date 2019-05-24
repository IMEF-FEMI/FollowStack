import React, { Component } from "react";
import atoms from "../../components/atoms";
import theme from "../../theme/instapaper/theme";
import withTheme from "./withTheme";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MainPageLoader from "../../components/loaders/MainPageLoader";
import Divider from "@material-ui/core/Divider";
import { fetchTweetsForProfile } from "../../../../../async/post";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  beginUnFollowAction,
  gainFollowersAction,
  checkTotalGainedAction
} from "../../../../../actions/gainFollowersAction";
import RenderTweets from "../../components/tweet/RenderTweets";
import { onScroll } from "../../components/tweet/utils";
import NavToTopButton from "../../components/tweet/NavToTopButton";

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
    this.onScroll = onScroll.call(this, this.fetchNextPage);
    this.signal = axios.CancelToken.source();
    this.topRef = React.createRef();
  }
  scrollToTop = () => {
    this.topRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  };
  toggleShowNavToTopButton = bool => {
    this.setState({ showNavToTop: bool });
  };
  fetchNextPage = () => {
    if (
      this.state.initialFetch ||
      this.state.isFetching ||
      !this.state.hasMore
    ) {
      return;
    }

    this.setState({ isFetching: true }, async () => {
      try {
        var userData = this.props.auth.userData;
        userData.recievedTweets = this.state.pages.length;

        const { data } = await fetchTweetsForProfile(
          userData,
          this.props.auth.keyInUse,
          this.state.page,
          this.signal.token
        );

        if (!data.length) {
          return this.setState({ hasMore: false, isFetching: false }, () => {});
        }
        console.log("tweets returned ", data);
        this.setState(
          {
            isFetching: false,
            page: this.state.page + 1,
            pages: [...this.state.pages, ...data]
          },
          () => {}
        );
      } catch (e) {
        if (axios.isCancel()) {
          return console.log(e.message);
        }
        console.log(e);
      }
    });
  };
  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);
    try {
      var userData = this.props.auth.userData;
      userData.recievedTweets = this.state.pages.length;
      const { data: tweets } = await fetchTweetsForProfile(
        userData,
        this.props.auth.keyInUse,
        this.state.page,
        this.signal.token
      );

      this.setState(
        { initialFetch: false, page: 1, pages: [...tweets] },
        () => {}
      );
      console.log("tweets returned ", tweets);
    } catch (e) {
      if (axios.isCancel()) {
        return console.log(e.message);
      }
      console.log(e);
    }
  }
  componentWillUnmount() {
    // Remove onScroll event listener
    window.removeEventListener("scroll", this.onScroll, false);
    // Cancel asyncs
    this.signal.cancel("Async call cancelled.");
  }

  render() {
    const upSm = window.innerWidth >= 600;
    const { totalGained } = this.props.gainFollowers;
    const { userProfile } = this.props.auth;

    return (
      <div ref={this.topRef}>
        <Box mb="44px">
          <div>
            <div>
              <Grid
                container
                spacing={24}
                style={{
                  paddingTop: "20px",
                  width: "100%"
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
            </div>
          </div>
        </Box>
        <Divider
          variant="fullWidth"
          style={{
            width: "100%"
          }}
        />

        <div
          style={{
            backgroundColor: "#2c3e50"
          }}
        >
          <div>
            {(this.state.initialFetch || this.state.switchingContext) && (
              <MainPageLoader />
            )}
          </div>

          {!this.state.initialFetch && (
            <React.Fragment>
              {this.state.pages && (
                <RenderTweets
                  pages={this.state.pages}
                  
                />
              )}
            </React.Fragment>
          )}

          {this.state.showNavToTop && (
            <NavToTopButton scrollToTop={this.scrollToTop} />
          )}

         { this.state.isFetching && (
            <CircularProgress
              style={{
                margin: "16px auto",
                display: "block"
              }}
              size={50}
            />
          )} 
        </div>
      </div>
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
