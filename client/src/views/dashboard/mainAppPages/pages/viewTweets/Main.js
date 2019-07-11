import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MainPageLoader from "../../components/loaders/MainPageLoader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import axios from "axios";

import {
  initialFetchAction,
  fetchNextAction
} from "../../../../../actions/viewTweetsAction";
import PeaMessageInput from "../../components/statusUpdate/PeaMessageInput";

import RenderTweetsMain from "../../components/tweet/RenderTweetsMain";
import { onScroll } from "../../components/tweet/utils";
import NavToTopButton from "../../components/tweet/NavToTopButton";
import {
  onSnackbarOpen,
  setSnackbarMessage,
  setSnackbarVariant
} from "../../../../../actions/snackbarAction";

class Main extends Component {
  constructor() {
    super();

    this.state = {
      showNavToTop: false
    };
    this.onScroll = onScroll.call(this, this.fetchNextPage);
    this.signal = axios.CancelToken.source();
    this.topRef = React.createRef();
    this.mediaFiles = [];
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

  onFileSelect = e => {
    const imgSize = 5242880;
    const vidSize = 15728640;
    const {
      setSnackbarMessage,
      setSnackbarVariant,
      onSnackbarOpen
    } = this.props;
    if (
      e.target.files[0].type.includes("image") ||
      e.target.files[0].type.includes("video")
    ) {
      const src = e.target.files[0] && URL.createObjectURL(e.target.files[0]);
      if (!src) {
        return;
      }
      // this.setState({ previewImage: src });
      // this.setState({
      //   file: e.target.files[0],
      //   fileSize: e.target.files[0].size
      // });
      if (e.target.files[0].type.includes("image")) {
        if (e.target.files[0].size <= imgSize) {
          this.mediaFiles.push({ file: e.target.files[0], src: src });
        } else {
          // file too large
          setSnackbarMessage("File Too large");
          setSnackbarVariant("error");
          onSnackbarOpen();
        }
      } else if (e.target.files[0].type.includes("video")) {
        if (e.target.files[0].size <= vidSize) {
          this.mediaFiles.push({ file: e.target.files[0], src: src });
        } else {
          // file too large
          setSnackbarMessage("File Too large");
          setSnackbarVariant("error");
          onSnackbarOpen();
        }
      }
    } else {
      // file type not supported
      setSnackbarMessage("File Type not supported");
      setSnackbarVariant("error");
      onSnackbarOpen();
    }
  };

  renderThumbnnails = () => {
    var mediaFiles = this.mediaFiles
    if (mediaFiles.length !== 0) {
      for (var i = mediaFiles.length - 1; i >= 0; i--) {
        return(
          <div className='card'> 
              <img src={mediaFiles[i].src} alt={mediaFiles[i].file.name} />
              {/* <FontAwesome
                name='times-circle'
                className='close'
                onClick={this.closeCard}
              /> */}
              <i
                className="close times-circle "
                style={{
                  color: "#ff3366"
                }}
              />
            </div>
        )
      }
    }
  };
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

        <div>
          <div
            style={{
              paddingTop: "20px"
            }}
          >
            <Grid container justify="center" spacing={2}>
              <Grid item xs={window.innerWidth >= 600 ? 8 : 12}>
                <PeaMessageInput multiple onFileChange={this.onFileSelect} />
                {this.renderThumbnnails()}
              </Grid>
            </Grid>
            {viewTweets.tweetInitialFetch && <MainPageLoader />}
          </div>

          {!viewTweets.tweetInitialFetch && (
            <div style={{ paddingTop: "20px" }}>
              {viewTweets.tweetPages && (
                <RenderTweetsMain
                  pages={viewTweets.tweetPages}
                  context="Main"
                  isFetching={viewTweets.tweetIsFetching}
                />
              )}
            </div>
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
  viewTweets: PropTypes.object.isRequired,
  initialFetchAction: PropTypes.func.isRequired,
  fetchNextAction: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  viewTweets: state.viewTweets
});
export default connect(
  mapStateToProps,
  {
    initialFetchAction,
    fetchNextAction,
    onSnackbarOpen,
    setSnackbarMessage,
    setSnackbarVariant
  }
)(Main);
