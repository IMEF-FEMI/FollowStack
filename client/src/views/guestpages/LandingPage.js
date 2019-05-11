import withRoot from "./modules/withRoot";
// --- Post bootstrap -----
import React, { Component } from "react";
import { PropTypes } from "prop-types";
import ProductCategories from "./modules/views/ProductCategories";
import ProductSmokingHero from "./modules/views/ProductSmokingHero";
import AppFooter from "../common/AppFooter";
import ProductHero from "./modules/views/ProductHero";
import ProductValues from "./modules/views/ProductValues";
import ProductHowItWorks from "./modules/views/ProductHowItWorks";
import ProductHow from "./modules/views/ProductHow";
import NavBar from "../common/NavBar";
import { connect } from "react-redux";

// import AppAppBar from "./modules/views/AppAppBar";

class LandingPage extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <React.Fragment>
        <NavBar />
        {/* <AppAppBar /> */}
        <ProductHero />
        <ProductValues />
        <ProductCategories />
        <ProductHow />
        <ProductHowItWorks />
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

export default withRoot(connect(mapStateToProps)(LandingPage));
// export default withRoot(LandingPage);
