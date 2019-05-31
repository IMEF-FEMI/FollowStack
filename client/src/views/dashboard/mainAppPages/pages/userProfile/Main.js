import React, { Component } from "react";
import atoms from "../../components/atoms";
import theme from "../../theme/instapaper/theme";
import withTheme from "./withTheme";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MainPageLoader from "../../components/loaders/MainPageLoader";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import RenderProfileTweets from "../../components/tweet/RenderProfileTweets";
import { onScroll } from "../../components/tweet/utils";
import NavToTopButton from "../../components/tweet/NavToTopButton";
import {initialFetchAction, fetchNextAction} from"../../../../../actions/myProfileActions"
const { Avatar, Typography } = atoms;

class Main extends Component {
  constructor() {
    super();

    this.state = {
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
  fetchNextPage = async() => {
    const {auth, myProfile, fetchNextAction} = this.props

    if (
      myProfile.initialFetch ||
      myProfile.isFetching ||
      !myProfile.hasMore
    ) {
      return;
    }
    //   // quick patches
    //   // append number of already recieved tweets and the database user_id
    var userData = auth.userData
      userData.recievedTweets = myProfile.pages.length
      userData.user_id = auth.user._id
     await fetchNextAction(userData, auth.keyInUse, myProfile.page, this.signal.token)
  };

  formatCount(count) {
    const readablize = num => {
      var e = Math.floor(Math.log(num) / Math.log(1000));
      return (num / Math.pow(1000, e)).toFixed(1) + "K";
    };

    if (count > 999) return readablize(count);
    else return count;
  }
  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);

    const {auth, myProfile, initialFetchAction} = this.props
    if(myProfile.initialFetch === true){

      // quick patches
      // append number of already recieved tweets and the database user_id
      var userData = auth.userData
      userData.recievedTweets = myProfile.pages.length
      userData.user_id = auth.user._id
     await initialFetchAction(userData, auth.keyInUse, myProfile.page, this.signal.token)
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
    const {myProfile} = this.props


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
                          <b>{this.formatCount(userProfile.followers)}</b> followers
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1">
                          <b>{this.formatCount(userProfile.following)}</b> following
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
            {(myProfile.initialFetch ) && (
              <MainPageLoader />
            )}
          </div>

          {!myProfile.initialFetch && (
            <React.Fragment>
              {myProfile.pages && (
                <RenderProfileTweets
                  pages={myProfile.pages}
                  context="profile"
                  isFetching={myProfile.isFetching}
                />
              )}
            </React.Fragment>
          )}

          {this.state.showNavToTop && (
            <NavToTopButton scrollToTop={this.scrollToTop} />
          )}

        </div>
      </div>
    );
  }
}

Main.propTypes = {
  gainFollowers: PropTypes.object.isRequired,
  myProfile: PropTypes.object.isRequired,
  initialFetchAction: PropTypes.func.isRequired,
  fetchNextAction: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth,
  gainFollowers: state.gainFollowers,
  myProfile: state.myProfile
});
export default connect(
  mapStateToProps,{initialFetchAction, fetchNextAction}
)(withTheme(theme)(Main));
