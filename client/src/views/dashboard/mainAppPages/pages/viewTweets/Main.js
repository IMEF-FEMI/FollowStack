import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";

import PropTypes from "prop-types";
import MainPageLoader from "../../components/loaders/MainPageLoader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import VideoPlayer from "simple-react-video-thumbnail";
import { ClapSpinner } from "react-spinners-kit";

import axios from "axios";

import {
  initialFetchAction,
  fetchNextAction,
  addStatus
} from "../../../../../actions/viewTweetsAction";
import PeaMessageInput from "../../components/statusUpdate/PeaMessageInput";

import RenderTweetsMain from "../../components/tweet/RenderTweetsMain";
import { onScroll } from "../../components/tweet/utils";
import NavToTopButton from "../../components/tweet/NavToTopButton";
import {
  enqueueSnackbar,
  closeSnackbar
} from "../../../../../actions/notistackActions";
import { setPoints } from "../../../../../actions/authActions";

import theme from "../../components/profile/theme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const styles = theme => ({
  card: {
    width: "60px",
    height: "60px"
  },
  media: {
    height: "60px"
  }
});
class Main extends Component {
  constructor() {
    super();

    this.state = {
      showNavToTop: false,
      newTweetLoading: false
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
    const imgSize = 5242880; //5mb
    const vidSize = 15728640; //15mb
    const { enqueueSnackbar, closeSnackbar } = this.props;
    if (this.mediaFiles.length === 4) {
      return;
    }
    const src = e.target.files[0] && URL.createObjectURL(e.target.files[0]);
    if (!src) {
      return;
    }
    if (
      e.target.files[0].type.includes("image") ||
      e.target.files[0].type.includes("video")
    ) {
      if (
        e.target.files[0].type.includes("image") &&
        !e.target.files[0].type.includes("gif")
      ) {
        if (e.target.files[0].size <= imgSize) {
          this.mediaFiles.push({ file: e.target.files[0], src: src });
          console.log(this.mediaFiles);
          this.forceUpdate();
        } else {
          // file too large
          enqueueSnackbar({
            message: "File Too large",
            options: {
              key: new Date().getTime() + Math.random(),
              variant: "error",
              action: key => (
                <Button
                  style={{ color: "#fff" }}
                  onClick={() => closeSnackbar(key)}
                >
                  dismiss
                </Button>
              )
            }
          });
        }
      } else if (e.target.files[0].type.includes("gif")) {
        if (e.target.files[0].size <= vidSize) {
          this.mediaFiles.push({ file: e.target.files[0], src: src });
          console.log(this.mediaFiles);
          this.forceUpdate();
        } else {
          // file too large
          enqueueSnackbar({
            message: "File Too large",
            options: {
              key: new Date().getTime() + Math.random(),
              variant: "error",
              action: key => (
                <Button
                  style={{ color: "#fff" }}
                  onClick={() => closeSnackbar(key)}
                >
                  dismiss
                </Button>
              )
            }
          });
        }
      } else if (e.target.files[0].type.includes("video")) {
        if (e.target.files[0].size <= vidSize) {
          this.mediaFiles.push({ file: e.target.files[0], src: src });
          console.log(this.mediaFiles);
          this.forceUpdate();
        } else {
          // file too large
          enqueueSnackbar({
            message: "File Too large",
            options: {
              key: new Date().getTime() + Math.random(),
              variant: "error",
              action: key => (
                <Button
                  style={{ color: "#fff" }}
                  onClick={() => closeSnackbar(key)}
                >
                  dismiss
                </Button>
              )
            }
          });
        }
      }
    } else {
      // file type not supported
      enqueueSnackbar({
        message: "File Type not supported",
        options: {
          key: new Date().getTime() + Math.random(),
          variant: "error",
          action: key => (
            <Button
              style={{ color: "#fff" }}
              onClick={() => closeSnackbar(key)}
            >
              dismiss
            </Button>
          )
        }
      });
    }
  };
  onFileRemove = file => {
    this.mediaFiles.splice(this.mediaFiles.indexOf(file), 1);
    this.forceUpdate();
  };
  onSubmit = tweet => {
    console.log("submitting ", tweet);
    const data = new FormData();
    const { enqueueSnackbar, closeSnackbar, addStatus } = this.props;
    this.setState({ newTweetLoading: true }, () => {
      this.mediaFiles.map(file => {
        return data.append(file.file.name, file.file);
      });

      data.append("tweet_text", JSON.stringify(tweet));
      data.append("userData", JSON.stringify(this.props.auth.userData));
      const config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };
      axios
        .post(`/api/post/new-tweet/${this.props.auth.keyInUse}`, data, config)
        .then(res => {
          if (res.data.success) {
            enqueueSnackbar({
              message: res.data.success,
              options: {
                key: new Date().getTime() + Math.random(),
                variant: "success",
                action: key => (
                  <Button
                    style={{ color: "#fff" }}
                    onClick={() => closeSnackbar(key)}
                  >
                    dismiss
                  </Button>
                )
              }
            });
            setPoints(res.data.points);
            addStatus(res.data.tweet);
            this.setState({ newTweetLoading: false });
            this.mediaFiles = [];
            this.forceUpdate();
          } else if (res.data.error) {
            enqueueSnackbar({
              message: res.data.error,
              options: {
                key: new Date().getTime() + Math.random(),
                variant: "error",
                action: key => (
                  <Button
                    style={{ color: "#fff" }}
                    onClick={() => closeSnackbar(key)}
                  >
                    dismiss
                  </Button>
                )
              }
            });
            this.setState({ newTweetLoading: false });
            this.mediaFiles = [];
          }
        });
    });
  };
  render() {
    const { viewTweets, classes } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Card className={"PeaFullProfile-root"}>
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
                  paddingTop: "20px",
                  width: "100%"
                }}
              >
                <Grid container justify="center" spacing={2}>
                  <Grid item xs={window.innerWidth >= 600 ? 8 : 10}>
                    <PeaMessageInput
                      multiple
                      onFileChange={this.onFileSelect}
                      files={this.mediaFiles}
                      loading={this.state.newTweetLoading}
                      onSubmit={this.onSubmit}
                    />
                  </Grid>
                </Grid>

                {this.mediaFiles.length !== 0 && !this.state.newTweetLoading && (
                  <Grid
                    container
                    direction="row"
                    wrap="wrap"
                    justify={"center"}
                    spacing={1}
                  >
                    {this.mediaFiles.map(file => {
                      if (
                        file.file.type.includes("video") ||
                        file.file.type.includes("gif")
                      ) {
                        return (
                          <Grid item key={file.file.name}>
                            <Card
                              className={classes.card}
                              onClick={() => this.onFileRemove(file)}
                            >
                              <CardActionArea>
                                <VideoPlayer
                                  videoUrl={file.src}
                                  snapshotAt={10}
                                />
                              </CardActionArea>
                            </Card>
                          </Grid>
                        );
                      } else {
                        return (
                          <Grid item key={file.file.name}>
                            <Card
                              className={classes.card}
                              onClick={() => this.onFileRemove(file)}
                            >
                              <CardActionArea>
                                <CardMedia
                                  className={classes.media}
                                  image={file.src}
                                  title={file.file.name}
                                />
                              </CardActionArea>
                            </Card>
                          </Grid>
                        );
                      }
                    })}
                    <Grid item xs={12}>
                      <Typography
                        align="center"
                        style={{
                          fontSize: "14px"
                        }}
                      >
                        Click on Image to remove
                      </Typography>
                    </Grid>
                  </Grid>
                )}
                {this.state.newTweetLoading && (
                  <Grid container justify="center" spacing={2}>
                    <Grid item>
                      <ClapSpinner
                        size={30}
                        color="#93788a"
                        loading={this.state.newTweetLoading}
                      />
                    </Grid>
                  </Grid>
                )}
                {
                  <div
                    style={{
                      paddingBottom: "20px",
                      paddingTop: "20px",
                      marginRight: "20px",
                      marginLeft: "20px"
                    }}
                  >
                    <ExpansionPanel>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography
                          align="center"
                          color="textPrimary"
                          gutterBottom
                        >
                          Read Me
                        </Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                      
                        <ul>
                          <li>
                            Please note that in order to get more likes, retweets and comments on your tweets
                          </li>
                          <li>
                            you have to engage with tweets currently shown on this page
                          </li>
                          <li>
                            by liking, retweeting and commmenting on them
                          </li>
                          <strong>
                            
                            <li>
                            By so doing, You earn Points
                          </li>
                          </strong>
                          <li>which will be required when sharing your tweet here for others to see</li>
                         
                        </ul>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </div>
                }
                {viewTweets.tweetInitialFetch && <MainPageLoader />}
              </div>

              {!viewTweets.tweetInitialFetch && (
                <div style={{ paddingTop: "20px", width: "98%" }}>
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
        </Card>
      </ThemeProvider>
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
export default compose(
  connect(
    mapStateToProps,
    {
      initialFetchAction,
      fetchNextAction,
      enqueueSnackbar,
      closeSnackbar,
      setPoints,
      addStatus
    }
  ),
  withStyles(styles)
)(Main);
