import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  ViberShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  GooglePlusIcon,
  ViberIcon,
  EmailIcon
} from "react-share";
import { connect } from "react-redux";
import axios from "axios";

import {
  onSnackbarOpen,
  onSnackbarClose,
  setSnackbarMessage,
  setSnackbarVariant
} from "../../../../../actions/snackbarAction";
import { setPoints } from "../../../../../actions/authActions";

class ShareLinks extends Component {
  getPoints = () => {
    const {
      onSnackbarClose,
      setSnackbarMessage,
      setSnackbarVariant,
      onSnackbarOpen,
      setPoints
    } = this.props;
    axios.get("/api/users/link-share-points").then(res => {
      onSnackbarClose();
      setSnackbarMessage("👍 Link shared +40 points earned");
      setSnackbarVariant("success");
      onSnackbarOpen();
      setPoints(res.data.points);
      console.log(res.data)
    });
  };
  render() {
    // const URL = window.location.host;
    const URL = "https://followstack.herokuapp.com";
    const TITLE =
      "Get more Followers, likes and comments on Follow-Stack.com The Number 1 twitter #followforfollow Platform";

    return (
      <div>
        <Grid item align="center">
          <div style={{ display: "inline-block" }}>
            <div style={{ display: "inline-block" }}>
              <FacebookShareButton
                url={URL}
                quote={TITLE}
                onShareWindowClose={this.getPoints}
              >
                <FacebookIcon size={52} round />
              </FacebookShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <GooglePlusShareButton
                url={URL}
                quote={TITLE}
                onShareWindowClose={this.getPoints}
              >
                <GooglePlusIcon size={52} round />
              </GooglePlusShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <TwitterShareButton
                url={URL}
                quote={TITLE}
                onShareWindowClose={this.getPoints}
              >
                <TwitterIcon size={52} round />
              </TwitterShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <TelegramShareButton
                url={URL}
                quote={TITLE}
                onShareWindowClose={this.getPoints}
              >
                <TelegramIcon size={52} round />
              </TelegramShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <WhatsappShareButton
                url={URL}
                quote={TITLE}
                onShareWindowClose={this.getPoints}
              >
                <WhatsappIcon size={52} round />
              </WhatsappShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <ViberShareButton
                url={URL}
                quote={TITLE}
                onShareWindowClose={this.getPoints}
              >
                <ViberIcon size={52} round />
              </ViberShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <EmailShareButton url={URL} title={TITLE}>
                <EmailIcon size={52} round />
              </EmailShareButton>
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}

export default connect(
  null,
  {
    onSnackbarOpen,
    onSnackbarClose,
    setSnackbarMessage,
    setSnackbarVariant,
    setPoints
  }
)(ShareLinks);
