import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import FacebookShareButton from "react-share";
import GooglePlusShareButton from "react-share";
import TwitterShareButton from "react-share";
import TelegramShareButton from "react-share";
import WhatsappShareButton from "react-share";
import ViberShareButton from "react-share";
import EmailShareButton from "react-share";
import FacebookIcon from "react-share";
import TwitterIcon from "react-share";
import TelegramIcon from "react-share";
import WhatsappIcon from "react-share";
import GooglePlusIcon from "react-share";
import ViberIcon from "react-share";
import EmailIcon from "react-share";
import Button from "@material-ui/core/Button";

class ShareSocial extends Component {
  componentDidMount() {
    if (this.props.user === undefined) {
      this.props.history.push({
        pathname: "/"
      });
    }
  }

  render() {
    const URL = "http://localhost:3000";
    const TITLE = "FollowStack";
    return (
      <div>
        <div className="p-4 ">
          <Grid item align="center">
            <strong className="text-dark d-block mb-2">
              {"Share our Links with your Friends to earn some Points"}
            </strong>
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
        <div
          style={{
            paddingTop: "10vh"
          }}
        >
          <div className="d-flex px-3 border-0">
            <Button
              theme="danger"
              variant="contained"
              color="secondary"
              onClick={this.props.prevStep}
            >
              Prev
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "auto" }}
              onClick={this.props.nextStep}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
export default ShareSocial;
