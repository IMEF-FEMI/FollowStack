import React, { Component } from "react";
import theme from "../../theme/instapaper/theme";
import withTheme from "./withTheme";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MainPageLoader from "../../components/loaders/MainPageLoader";
import Divider from "@material-ui/core/Divider";
import { fetchTweetsForMain } from "../../../../../async/post";
import axios from "axios";

import {
  beginUnFollowAction,
  gainFollowersAction,
  checkTotalGainedAction
} from "../../../../../actions/gainFollowersAction";
import RenderTweets from "../../components/tweet/RenderTweets";
import { onScroll } from "../../components/tweet/utils";
import NavToTopButton from "../../components/tweet/NavToTopButton";

class Main extends Component {
  constructor() {
    super();

    this.state = {
      context: "Main",
      searchTerms: null,
      page: 0,
      pages: [],
      initialFetch: true,
      isFetching: false,
      hasMore: true,
      switchingContext: false,
      showNavToTop: false
      // points: 0
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
        userData.user_id = this.props.auth.user._id;
        const { data } = await fetchTweetsForMain(
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
    console.info("Mounting again")
    try {
      var userData = this.props.auth.userData;
      userData.recievedTweets = this.state.pages.length;
      userData.user_id = this.props.auth.user._id;
      // append number of already recieved tweets and the database user_id
      const { data: tweets } = await fetchTweetsForMain(
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
                  context="Main"
                  isFetching={this.state.isFetching}
                  setPoints={this.setPoints}
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
