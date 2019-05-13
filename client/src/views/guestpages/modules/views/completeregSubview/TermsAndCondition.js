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

// @material-ui/core components
import {
  ListGroupItem,
  Button,
  CardBody,
  CardFooter,
  Alert
} from "shards-react";
class TermsAndCondition extends Component {
  constructor() {
    super();
    this.state = {
      checked: "",
      disabled: true,
      user: {},
      location: "",
      finished: false,
      errorMessage: ""
    };
    this.handleCheckedChanged = this.handleCheckedChanged.bind(this);
    this.finished = this.finished.bind(this);
  }
  finished() {
    const userData = this.state.user;
    userData.location = this.props.userLocation;
    this.setState({ user: userData });
    this.props.register(userData);
    this.setState({ finished: true });
    // console.log(JSON.stringify(userData))
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
      this.props.setUserProfile(this.state.user);
      this.props.history.push("/dashboard");
    } else if (nextProps.errors.userError) {
      this.setState({ errorMessage: nextProps.errors.userError });
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
          <CardBody>
            <ListGroupItem className="p-4  ">
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
            </ListGroupItem>
            <CardFooter>
              <ListGroupItem className="d-flex px-3 border-0">
                <Button theme="danger" onClick={this.props.prevStep}>
                  Prev
                </Button>
                <Button
                  theme="success"
                  className="ml-auto"
                  disabled={this.state.disabled}
                  onClick={this.finished}
                >
                  Finish
                </Button>
              </ListGroupItem>
            </CardFooter>
          </CardBody>
        )}

        {this.state.finished && <Spinner />}
        {this.state.errorMessage !== "" && (
          <Alert theme="danger" className="text-center">
            {this.state.errorMessage}
          </Alert>
        )}
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
