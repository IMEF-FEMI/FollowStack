import withRoot from "./modules/withRoot";
// --- Post bootstrap -----
import React, { Component } from "react";
import { PropTypes } from "prop-types";
import ProductSmokingHero from "./modules/views/ProductSmokingHero";
import AppFooter from "./modules/views/AppFooter";
import HeroUnit from "./modules/views/HeroUnit";
import ProductValues from "./modules/views/ProductValues";
import ProductHowItWorks from "./modules/views/ProductHowItWorks";
import ProductHow from "./modules/views/ProductHow";
import AppAppBar from "./modules/views/AppAppBar";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { initGA, trackPage } from "../../components/Tracking";

class LandingPage extends Component {
  constructor() {
    super();

    this.contentRef = React.createRef();
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/shared-tweets");
    } else {
      // TrackPage
      const page = "/landing-page" + this.props.location.search;
      initGA();
      trackPage(page);
    }
  }

  render() {
    return (
      <React.Fragment>
        <AppAppBar />
        <HeroUnit contentRef={this.contentRef} />
        <div ref={this.contentRef}>
          <ProductValues />
        </div>
        <ProductHowItWorks />
        <ProductHow />
        <ProductSmokingHero />
        <AppFooter />
      </React.Fragment>
    );
  }
}

LandingPage.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(withRoot(connect(mapStateToProps)(LandingPage)));
// export default withRoot(LandingPage);
