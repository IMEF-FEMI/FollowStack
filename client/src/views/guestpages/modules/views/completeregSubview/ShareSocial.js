import React, { Component } from "react";
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

// @material-ui/core components
import { ListGroupItem, Button, CardBody, CardFooter } from "shards-react";
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
      <CardBody>
        <ListGroupItem className="p-4  ">
          <strong className="text-dark d-block mb-2">
            {"Share our Links with your Friends to earn some Points"}
          </strong>
          <div style={{ display: "inline-block" }}>
            <div style={{ display: "inline-block" }}>
              <FacebookShareButton url={URL} title={TITLE}>
                <FacebookIcon size={52} round />
              </FacebookShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <GooglePlusShareButton url={URL} title={TITLE}>
                <GooglePlusIcon size={52} round />
              </GooglePlusShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <TwitterShareButton url={URL} title={TITLE}>
                <TwitterIcon size={52} round />
              </TwitterShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <TelegramShareButton url={URL} title={TITLE}>
                <TelegramIcon size={52} round />
              </TelegramShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <WhatsappShareButton url={URL} title={TITLE}>
                <WhatsappIcon size={52} round />
              </WhatsappShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <ViberShareButton url={URL} title={TITLE}>
                <ViberIcon size={52} round />
              </ViberShareButton>
            </div>

            <div style={{ display: "inline-block" }}>
              <EmailShareButton url={URL} title={TITLE}>
                <EmailIcon size={52} round />
              </EmailShareButton>
            </div>
          </div>
        </ListGroupItem>
        <CardFooter>
          <ListGroupItem className="d-flex px-3 border-0">
            <Button theme="danger" onClick={this.props.prevStep}>
              Prev
            </Button>
            <Button
              theme="primary"
              className="ml-auto"
              onClick={this.props.nextStep}
            >
              Next
            </Button>
          </ListGroupItem>
        </CardFooter>
      </CardBody>
    );
  }
}
export default ShareSocial;
