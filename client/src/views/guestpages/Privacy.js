import withRoot from "./modules/withRoot";
// --- Post bootstrap -----
import React from "react";
import Markdown from "./modules/components/Markdown";
import Typography from "./modules/components/Typography";
import LayoutBody from "./modules/components/LayoutBody";
import NavBar from "../modules/views/NavBar";
import {Navbar as SigndInNav} from "../dashboard/layouts/Navbar";
import privacy from "./modules/views/privacy.md";
import AppFooter from "../modules/views/AppFooter";
import { connect } from "react-redux";


function Privacy() {
  return (
    <React.Fragment>
    {this.props.auth.isAuthenticated === false && <NavBar />}
    {this.props.auth.isAuthenticated === true && <SigndInNav />}
      <LayoutBody margin marginBottom>
        <Typography variant="h3" gutterBottom marked="center" align="center">
          Privacy
        </Typography>
        <Markdown>{privacy}</Markdown>
      </LayoutBody>
      <AppFooter />
    </React.Fragment>
  );
}

Privacy.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(Privacy);
