import React from "react";
import ReactDOM from "react-dom";
import scriptLoader from "react-async-script-loader";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import axios from "axios";
import { compose } from "redux";
import { connect } from "react-redux";

import withStyles from "@material-ui/core/styles/withStyles";
import Loader from "../../../../../components/Loader/Loader";

import {
  enqueueSnackbar,
  closeSnackbar
} from "../../../../../actions/notistackActions";
import { setPoints } from "../../../../../actions/authActions";

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

let PayPalButton = null;
class PaypalButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButton: false
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
      this.setState({ showButton: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

    const isLoadedButWasntLoadedBefore =
      !this.state.showButton && !this.props.isScriptLoaded && isScriptLoaded;

    if (isLoadedButWasntLoadedBefore) {
      if (isScriptLoadSucceed) {
        PayPalButton = window.paypal.Buttons.driver("react", {
          React,
          ReactDOM
        });
        this.setState({ showButton: true });
      }
    }
  }
  createOrder = (data, actions) => {
    const { total, points } = this.props;
    return actions.order.create({
      purchase_units: [
        {
          description: points + " Points",
          amount: {
            currency_code: "USD",
            value: total
          }
        }
      ]
    });
  };

  onApprove = (data, actions) => {
    const {
      enqueueSnackbar,
      closeSnackbar,
      setPoints,
      goBack,
      points,
      total
    } = this.props;
    this.setState({ showButton: false });
    actions.order.capture().then(details => {
      const paymentData = {
        payerID: data.payerID,
        orderID: data.orderID
      };
      console.log("Payment Approved: ", paymentData);
      axios
        .post("/api/users/paypal-transaction-complete", {
          orderID: paymentData.orderID,
          payment: {
            points: points,
            amount: total
          }
        })
        .then(res => {
          if (res.status === 200) {
            // notify transact success

            enqueueSnackbar({
              message: res.data.success ? res.data.success : res.data.error,
              options: {
                key: new Date().getTime() + Math.random(),
                variant: res.data.success ? "success" : "error",
                action: key => (
                  <Button
                    style={{ color: "#fff" }}
                    onClick={() => closeSnackbar(key)}
                  >
                    dismiss
                  </Button>
                )
              }
            });
            setPoints(points);
            // add points
            setPoints(res.data.points);

            // go back
            goBack();
          }
        });
    });
  };

  render() {
    const { showButton } = this.state;
    const { total, points, classes, goBack } = this.props;

    return (
      <div className={classes.root}>
        {<Loader showLoader={!showButton} />}

        {showButton && (
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

              <PayPalButton
                createOrder={(data, actions) => this.createOrder(data, actions)}
                onApprove={(data, actions) => this.onApprove(data, actions)}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default compose(
  connect(
    null,
    {
      enqueueSnackbar,
      closeSnackbar,
      setPoints
    }
  ),
  withStyles(styles),
  scriptLoader(`https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`)
)(PaypalButton);
