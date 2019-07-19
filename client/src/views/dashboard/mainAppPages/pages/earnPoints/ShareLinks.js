import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import axios from "axios";

import {
  enqueueSnackbar,
  closeSnackbar
} from "../../../../../actions/notistackActions";
import { setPoints } from "../../../../../actions/authActions";
import PeaButton from "../../components/profile/PeaButton";
import Share from "@material-ui/icons/Share";
import SvgIcon from "@material-ui/core/SvgIcon";

class ShareLinks extends Component {
  state = {
    followLoading: false,
    shareLoading: false
  };
  getPoints = () => {
    const { enqueueSnackbar, closeSnackbar, setPoints } = this.props;
    axios.get(`/api/post/share-link/${this.props.auth.keyInUse}`).then(res => {
      enqueueSnackbar({
        message: "👍 Link shared +40 points earned",
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
      console.log(res.data);
    });
  };

  followUs = () => {
    const { enqueueSnackbar, closeSnackbar, setPoints } = this.props;
    this.setState({ followLoading: true });
    axios
      .post(`/api/post/follow-us/${this.props.auth.keyInUse}`, {
        userData: this.props.auth.userData
      })
      .then(res => {
        this.setState({ followLoading: false });
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
        } else if (res.data.following) {
          enqueueSnackbar({
            message: res.data.following,
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
        }
      })
      .catch(err => {
        this.setState({ followLoading: false });
        enqueueSnackbar({
          message: err,
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
      });
  };

  shareLink = () => {
    const { enqueueSnackbar, closeSnackbar, setPoints } = this.props;
    this.setState({ shareLoading: true });
    axios
      .post(`/api/post/share-link/${this.props.auth.keyInUse}`, {
        userData: this.props.auth.userData
      })
      .then(res => {
        this.setState({ shareLoading: false });

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
        }
      })
      .catch(err => {
        this.setState({ shareLoading: false });
        enqueueSnackbar({
          message: err,
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
      });
  };

  render() {
    const twitterIcon = (
      <SvgIcon
        style={{
          color: "rgb(28, 136, 204)"
        }}
      >
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </SvgIcon>
    );
    return (
      <Grid container justify="center">
        <Grid item>
          <PeaButton
            color="primary"
            size={"small"}
            variant={"outlined"}
            labelExpanded={false}
            icon={!this.state.followLoading ? twitterIcon : ""}
            iconProps={{
              color: "default",
              size: "small"
            }}
            loading={this.state.followLoading}
            style={{ marginTop: 6 }}
            onClick={this.followUs}
          >
            {"Follow Us"}
          </PeaButton>
        </Grid>
        <Grid item>
          <PeaButton
            color="primary"
            size={"small"}
            variant={"outlined"}
            labelExpanded={false}
            icon={
              !this.state.shareLoading ? (
                <Share
                  style={{
                    color: "rgb(28, 136, 204)"
                  }}
                />
              ) : (
                ""
              )
            }
            iconProps={{
              color: "default",
              size: "small"
            }}
            loading={this.state.shareLoading}
            style={{ marginTop: 6 }}
            onClick={this.shareLink}
          >
            {"Share Link"}
          </PeaButton>
        </Grid>
      </Grid>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    enqueueSnackbar,
    closeSnackbar,
    setPoints
  }
)(ShareLinks);
