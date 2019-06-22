// --- Post bootstrap -----
import React, { Component } from "react";
import AppFooter from "./modules/views/AppFooter";
import Markdown from "./modules/components/Markdown";
import Typography from "./modules/components/Typography";
import terms from "./modules/views/terms.md";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import AppAppBar from "./modules/views/AppAppBar";
import { Topbar } from "../dashboard/layouts/layout/Dashboard/components";
import { initGA, trackPage } from "../../components/Tracking";

class Terms extends Component {
  constructor(props) {
    super(props);

    this.state = { terms: "" };
  }
  async componentWillMount() {
    const that = this;

    await fetch(terms)
      .then(response => response.text())
      .then(text => {
        that.setState({ terms: text });
      });

    // TrackPage
    const page = this.props.location.pathname + this.props.location.search;
    initGA();
    trackPage(page);
  }
  render() {
    return (
      <React.Fragment>
        {this.props.auth.isAuthenticated === false && <AppAppBar />}
        {this.props.auth.isAuthenticated === true && <Topbar />}
        <Container>
          <Box mt={7} mb={12}>
            <Typography
              variant="h3"
              gutterBottom
              marked="center"
              align="center"
            >
              Terms
            </Typography>
            <Markdown>{this.state.terms}</Markdown>
          </Box>
        </Container>
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
