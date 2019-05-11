// --- Post bootstrap -----
import React from "react";
import AppFooter from "../common/AppFooter";
import NavBar from "../common/NavBar";
import Markdown from "./modules/components/Markdown";
import Typography from "./modules/components/Typography";
import LayoutBody from "./modules/components/LayoutBody";
import terms from "./modules/views/terms.md";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SigndInNav from "../common/SigndInNav";

class Terms extends React.Component {
  render() {
    return (
      <React.Fragment>
        {!this.props.auth.isAuthenticated && <NavBar />}
        {this.props.auth.isAuthenticated && <SigndInNav />}
        <LayoutBody margin marginBottom>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Terms
          </Typography>
          <Markdown>{terms}</Markdown>
        </LayoutBody>
        <AppFooter />
      </React.Fragment>
    );
  }
}
Terms.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(Terms);
