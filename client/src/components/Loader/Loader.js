import React, { Component } from "react";
import { Backdrop, SpinnerRectangleBounce } from "./components";

class Loader extends Component {
  render() {
    return (
      <React.Fragment>
        <Backdrop show={this.props.showLoader} />
        <SpinnerRectangleBounce
          size="normal"
          color="grey"
          class="z-50 absolute"
          show={this.props.showLoader}
          style={{
            left: "50%",
            top: "50%",
            marginLeft: "-25px",
            marginRight: "-25px"
          }}
        />
      </React.Fragment>
    );
  }
}

export default Loader;
