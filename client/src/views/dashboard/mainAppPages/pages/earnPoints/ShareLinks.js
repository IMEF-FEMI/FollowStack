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

class ShareLinks extends Component {
  render() {
    const URL = window.location.host;
    const TITLE = "Gain more Followers, likes and comments on FollowStack.com The ultimate Like4like Application";

    return (
      <div>
        <Grid item align="center">
          <div style={{ display: "inline-block" }}>
            <div style={{ display: "inline-block" }}>
              <FacebookShareButton url={URL} quote={TITLE}>
                <FacebookIcon size={52} round />
              </FacebookShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <GooglePlusShareButton url={URL} quote={TITLE}>
                <GooglePlusIcon size={52} round />
              </GooglePlusShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <TwitterShareButton url={URL} quote={TITLE}>
                <TwitterIcon size={52} round />
              </TwitterShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <TelegramShareButton url={URL} quote={TITLE}>
                <TelegramIcon size={52} round />
              </TelegramShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <WhatsappShareButton url={URL} quote={TITLE}>
                <WhatsappIcon size={52} round />
              </WhatsappShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <ViberShareButton url={URL} quote={TITLE}>
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
export default (ShareLinks);
