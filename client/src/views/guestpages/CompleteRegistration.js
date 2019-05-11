// --- Post bootstrap -----
import React from "react";
import { withRouter } from "react-router-dom";
import RegionSelect from "./modules/views/completeregSubview/RegionSelect";
import ShareSocial from "./modules/views/completeregSubview/ShareSocial";
import TermsAndCondition from "./modules/views/completeregSubview/TermsAndCondition";
import AppFooter from "../common/AppFooter";
import NavBar from "../common/NavBar";
// import { email, required } from "./modules/form/validation";

import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Progress
} from "shards-react";

const containerFluid = {
  paddingRight: "15px",
  paddingLeft: "15px",
  marginRight: "auto",
  marginLeft: "auto",
  width: "100%"
};

const container = {
  ...containerFluid,
  zIndex: "2",
  position: "relative",
  paddingTop: "20vh",
  paddingBottom: "20vh",
  color: "#FFFFFF"
};

class CompleteRegistration extends React.Component {
  state = {
    step: 1,
    user: {},
    provider: "",
    location: ""
  };

  handleCurrentCity = e => {
    this.setState({
      location: e.value
    });
  };

  componentDidMount() {
    if (this.props.location.state === undefined) {
      this.props.history.push({
        pathname: "/"
      });
    } else {
      this.setState({
        user: this.props.location.state.user
      });
      this.setState({
        provider: this.props.location.state.provider
      });
    }
  }

  componentWillReceiveProps(props) {
    if (props.location.state === undefined) {
      props.history.push({
        pathname: "/"
      });
    } else {
      this.setState({
        user: props.location.state.user
      });
      this.setState({
        provider: props.location.state.provider
      });
    }
  }
  nextStep = () => {
    this.setState({
      step: this.state.step + 1
    });
  };

  previousStep = () => {
    this.setState({
      step: this.state.step - 1
    });
  };

  render() {
    const image = require("./assets/img/socialmedia.jpg");
    return (
      <div
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <NavBar />
        <div style={container} className="col-sm-6 col-xs-6 col-md-6">
          {/* <div className="col-sm-12 col-xs-12 col-md-12 d-flex justify-content-center"> */}
          <Card small>
            <CardHeader className="border-bottom text-center">
              <div className="mb-3 mx-auto">
                <img
                  className="rounded-circle"
                  src={this.state.user.photo}
                  alt={this.state.user.username}
                  width="110"
                />
              </div>
              <h4 className="mb-0">{this.state.user.username}</h4>
            </CardHeader>

            <ListGroup flush>
              <ListGroupItem className="px-4">
                <div className="progress-wrapper">
                  <strong className="text-muted d-block mb-2">
                    {"Progress"}
                  </strong>
                  <Progress
                    className="progress-sm"
                    value={33.3333 * this.state.step}
                  />
                </div>
              </ListGroupItem>
              {this.state.step === 1 && (
                <RegionSelect
                  value={this.state.location}
                  nextStep={this.nextStep}
                  user={this.state.user}
                  provider={this.state.provider}
                  onChange={this.handleCurrentCity}
                />
              )}

              {this.state.step === 2 && (
                <ShareSocial
                  nextStep={this.nextStep}
                  prevStep={this.previousStep}
                  user={this.state.user}
                  provider={this.props.location.state.provider}
                />
              )}
              {this.state.step === 3 && (
                <TermsAndCondition
                  user={this.state.user}
                  provider={this.props.location.state.provider}
                  prevStep={this.previousStep}
                  userLocation={this.state.location}
                />
              )}
            </ListGroup>
          </Card>
        </div>
        <AppFooter />
      </div>
    );
  }
}

export default withRouter(CompleteRegistration);
