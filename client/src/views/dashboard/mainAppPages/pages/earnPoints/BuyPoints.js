import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import BuyPointsSection from "./BuyPointsSection";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { ArrowBack as ArrowBackIcon } from "@material-ui/icons";

// import { PayPalButton } from "react-paypal-button-v2";

const CLIENT = {
  sandbox:
    "AZ42Vzic_sZc6kiyVvrsvORgD81cQkRSIVryHtvqCNmq7z3pSZSiHWyCeIf0Ls2ZCLlfSCNS3EKlSLiy",
  production:
    "ATPCd1VwSyINjPV5R3NN5uMBQ1bfr7uRBm2C95YBLmly1trNx0OHV0EnCLi0dTaUBx-NYurv-lL-BOBh"
};

const CLIENT_ID =
  process.env.NODE_ENV === "production" ? CLIENT.production : CLIENT.sandbox;

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: "100vh"
  },
  grid: {
    height: "100%"
  },
  content: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  contentHeader: {
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing.unit * 5,
    paddingBototm: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  }
});
class BuyPoints extends Component {
  state = {
    step: "section",
    total: 100
  };
  pay = amount => {
    this.setState({ step: "pay", total: amount });
  };
  handleBack = () => {
    this.props.history.goBack();
  };
  render() {
    const { step, total } = this.state;
    const {classes} = this.props

    // paypal button functions
    const onSuccess = payment => console.log("Successful payment!", payment);

    const onError = error =>
      console.log("Erroneous payment OR failed to load script!", error);

    const onCancel = data => console.log("Cancelled payment!", data);

    switch (step) {
      case "section":
        return <BuyPointsSection pay={this.pay} />;

      case "pay":
        return (
          <div className={classes.root}>
            <Grid className={classes.grid} container>
              <Grid className={classes.content} item lg={7} xs={12}>
                <div className={classes.content}>
                  <div className={classes.contentHeader}>
                    <IconButton
                      className={classes.backButton}
                      onClick={this.handleBack}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </div>
                  <div className={classes.contentBody}>
                    <Typography className={classes.title} variant="h2">
                      Payment
                    </Typography>
                    {/* <PayPalButton
                      commit={true}
                      currency={"USD"}
                      amount={total}
                      onSuccess={onSuccess}
                      onError={onError}
                      onCancel={onCancel}
                      options={{
                        clientId: CLIENT_ID
                      }}
                    /> */}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        );
      default:
        return <BuyPointsSection />;
    }
  }
}

export default withRouter(withStyles(styles)(BuyPoints));
