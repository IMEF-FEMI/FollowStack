import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  register,
  setUserData,
  setUserProfile
} from "../../../../../actions/authActions";

import Spinner from "./Spinner";

import Button from "@material-ui/core/Button";
import CustomSnackbar from "../../../../../components/CustomSnackbar";


class TermsAndCondition extends Component {
  constructor() {
    super();
    this.state = {
      checked: "",
      disabled: true,
      user: {},
      location: "",
      finished: false,
      snackbarOpen: false,
      snackbarMessage: "",
      snackbarvariant: "",
      vertical: "top",
      horizontal: "right"
    };
    this.handleCheckedChanged = this.handleCheckedChanged.bind(this);
    this.finished = this.finished.bind(this);
  }
  onSnackbarOpen = () => {
    this.setState({ snackbarOpen: true }, () => {});
  };

  onSnackbarClose = () => {
    this.setState({ snackbarOpen: false }, () => {});
  };
  notify = (message, variant) => {
    this.setState(
      {
        snackbarMessage: message,
        snackbarvariant: variant
      },
      () => {
        this.onSnackbarOpen();
      }
    );
  };
  finished() {
    const userData = this.state.user;
    userData.location = this.props.userLocation;
    this.setState({ user: userData });
    this.props.register(userData);
    this.setState({ finished: true });
  }
  componentDidMount() {
    if (this.props.user) {
      this.setState({
        user: this.props.user,
        location: this.props.userLocation
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.setUserData(this.state.user);
      this.props.setUserProfile(this.state.user, this.props.auth.keyInUse);
      this.props.nextStep();
      this.props.gotoDashboard();
    } else if (nextProps.errors.userError) {
     
      this.notify(nextProps.errors.userError, "error");

    }
  }

  handleCheckedChanged(event) {
    this.setState({ checked: event.target.checked });
    this.setState({ disabled: !event.target.checked });
  }

  render() {
    return (
      <div>
        {!this.state.finished && (
          <div>
            <div className="p-4  ">
              <strong className="text-dark d-block mb-2">
                {"Terms And Conditions"}
              </strong>

              <div className="row ml-auto mr-auto">
                <div className="ten columns terms">
                  <span className="text-dark">
                    By clicking "Accept" I agree that:
                  </span>
                  <ul className="docs-terms">
                    <li className="text-dark">
                      I have read and accepted the{" "}
                      <Link to="/terms">Terms</Link>
                    </li>
                    <li className="text-dark">
                      I have read and accepted the{" "}
                      <Link to="/privacy">Privacy Policy</Link>
                    </li>
                  </ul>
                  <label>
                    <input
                      type="checkbox"
                      checked={this.state.checked}
                      onChange={this.handleCheckedChanged}
                      autoFocus
                    />
                    <span className="text-dark ml-auto mr-auto"> Accept </span>{" "}
                  </label>
                </div>
              </div>
            </div>
            <div
              style={{
                paddingTop: "5vh"
              }}
            >
              <div className="d-flex px-3 border-0">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.props.prevStep}
                >
                  Prev
                </Button>
                <Button
                  color="primary"
                  className="ml-auto"
                  disabled={this.state.disabled}
                  onClick={this.finished}
                  variant="contained"
                  style={{
                    backgroundColor: "#28a745",
                    borderColor: "#28a745"
                  }}
                >
                  Finish
                </Button>
              </div>
            </div>
          </div>
        )}

        {this.state.finished && <Spinner />}
        <CustomSnackbar
          snackbarOpen={this.state.snackbarOpen}
          variant={this.state.snackbarvariant}
          message={this.state.snackbarMessage}
          onSnackbarOpen={this.onSnackbarOpen}
          onSnackbarClose={this.onSnackbarClose}
          horizontal={this.state.horizontal}
          vertical={this.state.vertical}
        />
      </div>
    );
  }
}
TermsAndCondition.propTypes = {
  register: PropTypes.func.isRequired,
  setUserData: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(
  connect(
    mapStateToProps,
    { register, setUserData, setUserProfile }
  )(TermsAndCondition)
);
