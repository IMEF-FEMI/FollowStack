import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import withStyles from "@material-ui/core/styles/withStyles";

import { PayPalButton } from "react-paypal-button-v2";

import Loader from "../../../../../components/Loader/Loader";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: "100vh",
    textAlign: "center"
  },
  content: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  title: {
    paddingBottom: theme.spacing(5)
  },
  contentHeader: {
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(18),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
});

const CLIENT = {
  sandbox:
    "AZ42Vzic_sZc6kiyVvrsvORgD81cQkRSIVryHtvqCNmq7z3pSZSiHWyCeIf0Ls2ZCLlfSCNS3EKlSLiy",
  production:
    "ATPCd1VwSyINjPV5R3NN5uMBQ1bfr7uRBm2C95YBLmly1trNx0OHV0EnCLi0dTaUBx-NYurv-lL-BOBh"
};

const CLIENT_ID =
  process.env.NODE_ENV === "production" ? CLIENT.production : CLIENT.sandbox;

class PaypalButtonSection extends Component {
  state = {
    showLoader: true
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({ showLoader: false });
    }, 1000);
  }

  // paypal button functions
  onSuccess = payment => {
    console.log("Successful payment!", payment);
  };

  onError = error => {
    console.log("Erroneous payment OR failed to load script!", error);
  };

  onCancel = data => {
    console.log("Cancelled payment!", data);
  };
  render() {
    const { total, points, classes, goBack } = this.props;
    const { showLoader } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.contentHeader}>
            <IconButton className={classes.backButton} onClick={goBack}>
              <ArrowBackIcon />
            </IconButton>
          </div>
          <div className={classes.contentBody}>
            <div className={classes.title}>
              <Typography component="h2" variant="h3" color="textPrimary">
                ${total}
              </Typography>
              <Typography component="h4" variant="h5" color="textPrimary">
                {points} Points
              </Typography>
            </div>
            {<Loader showLoader={showLoader} />}
              <PayPalButton
                commit={true}
                currency={"USD"}
                amount={total}
                onSuccess={this.onSuccess}
                onError={this.onError}
                onCancel={this.onCancel}
                options={{
                  clientId: CLIENT_ID
                }}
              />
          </div>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(PaypalButtonSection);
