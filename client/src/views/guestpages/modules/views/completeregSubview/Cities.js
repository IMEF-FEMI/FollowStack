import React, { Component } from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const CITIES = require("./data/cities");

let section_width = {
  maxWidth: "450px",
  margin: "0 auto"
};

class Cities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: "ALL",
      disabled: false,
      searchable: this.props.searchable,
      selectValue: "Pick a Region and Search!",
      clearable: false
    };

    this.updateValue = this.updateValue.bind(this);
  }
  updateValue(newValue) {
    this.setState({
      selectValue: newValue
    });

    this.props.onChange(newValue);
  }
  render() {
    var options = CITIES[this.state.region];
    options.sort(function(a, b) {
      a = a.value.toLowerCase();
      b = b.value.toLowerCase();

      return a < b ? -1 : a > b ? 1 : 0;
    });
    return (
      <div style={section_width}>
        {
          <Select
            ref="stateSelect"
            options={options}
            simpleValue
            clearable={this.state.clearable}
            name="selected-state"
            disabled={this.state.disabled}
            value={this.state.selectValue}
            onChange={this.updateValue}
            searchable={this.state.searchable}
            className="text-dark"
          />
        }
      </div>
    );
  }
}

Cities.defaultProps = {
  label: "States:",
  searchable: true
};
Cities.propTypes = {
  label: PropTypes.string,
  searchable: PropTypes.bool,
  setState: PropTypes.func
};

export default Cities;
