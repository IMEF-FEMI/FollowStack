import React, { Component } from "react";
import Cities from "./Cities.js";

// @material-ui/core components
import Button from "@material-ui/core/Button";
class RegionSelect extends Component {
  state = {
    selected: "",
    disabled: true
  };
  componentWillReceiveProps(props) {
    const selected = this.getSelectedFromProps(props);
    this.setState({ selected: selected.value });
    if (selected) {
      this.setState({ disabled: false });
    }
  }
  componentDidMount() {
    if (this.props.user === undefined) {
      this.props.history.push({
        pathname: "/"
      });
    }
  }

  getSelectedFromProps(props) {
    var selected;
    if (props.value.value === null && props.option.length !== 0) {
      selected = props.options[0][props.valueField];
    } else {
      selected = props.value;
    }
    return selected;
  }

  render() {
    return (
      <div>
        <div className="p-4 ">
          <strong className="text-dark d-block mb-2">
            {"Select your Location or Location closest to you"}
          </strong>
          <Cities label="States" onChange={this.props.onChange} searchable />
          {this.state.selected !== "" && (
            <i className="text-dark d-block mb-2">{this.state.selected}</i>
          )}
        </div>
        <div
          style={{
            paddingTop: "10vh"
          }}
        >
            <Button
              variant="contained"
              color="primary"
              style={{
                marginLeft: "auto"
              }}
              onClick={this.props.nextStep}
              disabled={this.state.disabled}
            >
              Next
            </Button>
        </div>
      </div>
    );
  }
}
export default RegionSelect;
