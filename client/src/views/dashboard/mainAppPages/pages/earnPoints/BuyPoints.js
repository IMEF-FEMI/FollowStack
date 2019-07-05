import React, { Component } from "react";

import BuyPointsSection from "./BuyPointsSection";
import PaypalButton from "./PaypalButton";

class BuyPoints extends Component {
  state = {
    step: "section",
    total: 0,
    points: 0
  };

  pay = amount => {
    this.setState({ step: "pay", total: amount.total, points: amount.points });
  };
  handleBack = () => {
    this.setState({ step: "section", total: 0 });
  };
  
  render() {
    const { step, total, points } = this.state;

    switch (step) {
      case "section":
        return <BuyPointsSection pay={this.pay} />;

      case "pay":
        return (
          <PaypalButton
            total={total}
            points={points}
            goBack={this.handleBack}
          />
        );
      default:
        return <BuyPointsSection />;
    }
  }
}

export default BuyPoints;
