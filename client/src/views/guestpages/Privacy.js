// --- Post bootstrap -----
import React, { Component } from "react";
import AppFooter from "./modules/views/AppFooter";
import Markdown from "./modules/components/Markdown";
import Typography from "./modules/components/Typography";
import privacy from "./modules/views/privacy.md";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import AppAppBar from "./modules/views/AppAppBar";
import {Topbar} from "../dashboard/layouts/layouts/Dashboard/components"

class Privacy extends Component {
  constructor(props) {
    super(props);

    this.state = { privacy: "" };
  }
  async componentWillMount() {
    const that = this;

   await fetch(privacy)
      .then(response => response.text())
      .then(text => {
        that.setState({ privacy: text });
      });
  }
  render() {
    return (
      <React.Fragment>
      {this.props.auth.isAuthenticated === false && <AppAppBar />}
        {this.props.auth.isAuthenticated === true && <Topbar />}
      <Container>
        <Box mt={7} mb={12}>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Privacy
          </Typography>
          <Markdown>{this.state.privacy}</Markdown>
        </Box>
      </Container>
      <AppFooter />
    </React.Fragment>
    );
  }
}
Privacy.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(Privacy);
