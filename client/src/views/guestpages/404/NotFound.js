import React, { Component } from "react";
import Profile from "./profile.jpg";
import { Link, withRouter } from "react-router-dom";
import { initGA, trackPage } from "../../../components/Tracking";

import "./notFound.css";

class NotFound extends Component {
  componentDidMount() {
    // TrackPage
    const page = "/not-found" + this.props.location.search;
    initGA();
    trackPage(page);
  }
  render() {
    return (
      <div className="land-container">
        <div className="land-body-background" />
        <div className="land-body-polygon" />
        <section className="land-body">
          <figure className="land-body-profile">
            <img src={Profile} alt="profile" />
          </figure>
          <div className="land-body-404">
            <h2 className="land-body-title">
              ERROR <span>404</span>
            </h2>

            <h3 className="land-body-halfTitle">Page Not Found!</h3>
            <div className="land-body-buttons">
              <button
                className="land-body-report"
                onClick={() => {
                  this.props.history.goBack();
                }}
              >
                GO BACK
              </button>
              <Link to="/" className="land-body-back">
                TAKE ME HOME
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default withRouter(NotFound);
