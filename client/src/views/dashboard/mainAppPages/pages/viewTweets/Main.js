import React, { Component } from "react";
import theme from "../../theme/instapaper/theme";
import withTheme from "./withTheme";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MainPageLoader from "../../components/loaders/MainPageLoader";
import Divider from "@material-ui/core/Divider";
import axios from "axios";

import {
  initialFetchAction,
  fetchNextAction
} from "../../../../../actions/viewTweetsAction";

import RenderTweetsMain from "../../components/tweet/RenderTweetsMain";
import { onScroll } from "../../components/tweet/utils";
import NavToTopButton from "../../components/tweet/NavToTopButton";

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
  fetchNextPage = async () => {
    const { auth, viewTweets, fetchNextAction } = this.props;

    if (
      viewTweets.tweetInitialFetch ||
      viewTweets.tweetIsFetching ||
      !viewTweets.tweetHasMore
    ) {
      return;
    }
    //   // quick patches
    //   // append number of already recieved tweets and the database user_id
    var userData = auth.userData;
    userData.recievedTweets = viewTweets.tweetPages.length;
    userData.user_id = auth.user._id;
    await fetchNextAction(
      userData,
      auth.keyInUse,
      viewTweets.tweetPage,
      this.signal.token
    );
  };

  async componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);
    // this.forceUpdate();

    const { auth, viewTweets, initialFetchAction } = this.props;
    if (viewTweets.tweetInitialFetch === true) {
      // quick patches
      // append number of already recieved tweets and the database user_id
      var userData = auth.userData;
      userData.recievedTweets = viewTweets.tweetPages.length;
      userData.user_id = auth.user._id;
      await initialFetchAction(
        userData,
        auth.keyInUse,
        viewTweets.tweetPage,
        this.signal.token
      );
    }
  }
  componentWillUnmount() {
    // Remove onScroll event listener
    window.removeEventListener("scroll", this.onScroll, false);
    // Cancel asyncs
    this.signal.cancel("Async call cancelled.");
  }

  render() {
    const { viewTweets } = this.props;

    return (
      <div ref={this.topRef}>
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
          <div>{viewTweets.tweetInitialFetch && <MainPageLoader />}</div>

          {!viewTweets.tweetInitialFetch && (
            <React.Fragment>
              {viewTweets.tweetPages && (
                <RenderTweetsMain
                  pages={viewTweets.tweetPages}
                  context="Main"
                  isFetching={viewTweets.tweetIsFetching}
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
  viewTweets: PropTypes.object.isRequired,
  initialFetchAction: PropTypes.func.isRequired,
  fetchNextAction: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  gainFollowers: state.gainFollowers,
  viewTweets: state.viewTweets
});
export default connect(
  mapStateToProps,
  { initialFetchAction, fetchNextAction }
)(withTheme(theme)(Main));
