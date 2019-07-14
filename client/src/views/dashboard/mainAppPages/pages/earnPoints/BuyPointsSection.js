import React, { Component } from "react";
import Container from "@material-ui/core/Container";

import compose from "recompose/compose";
import { withRouter } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import withStyles from "@material-ui/core/styles/withStyles";

import AddShoppingCart from "@material-ui/icons/AddShoppingCart";
import Payment from "@material-ui/icons/Payment";
import StarIcon from "@material-ui/icons/StarBorder";

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    },
    ul: {
      margin: 0,
      padding: 0
    },
    li: {
      listStyle: "none"
    }
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  content: {
    padding: theme.spacing(8, 0, 6)
  },
  container: {
    paddingBottom: "50px"
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200]
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2)
  },
  logoDivider: {
    marginBottom: theme.spacing(2)
  }
});

const tiers = [
  {
    title: "Bronze",
    logo: <AddShoppingCart />,
    price: "3.00",
    points: 500,

    description: (
      <Typography component="li" variant="subtitle1" align="center">
        <i
          className="fas fa-coins"
          style={{
            color: "#17bf63"
          }}
        />{" "}
        500 Points
      </Typography>
    ),
    buttonText: "Pay",
    buttonVariant: "outlined",
    onClick: function(contentRef) {
      contentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
  },
  {
    title: "Silver",
    logo: <AddShoppingCart />,
    price: "5.00",
    pathName: "/shared-tweets",
    points: 800,
    description: (
      <div>
        <Typography component="li" variant="subtitle1" align="center">
          <i
            className="fas fa-coins"
            style={{
              color: "#17bf63"
            }}
          />{" "}
          800 Points
        </Typography>
      </div>
    ),

    buttonText: "Pay",
    buttonVariant: "contained"
  },
  {
    title: "Gold",
    logo: <AddShoppingCart />,
    price: "7.00",
    points: 1200,

    pathName: "/online-users",
    description: (
      <Typography component="li" variant="subtitle1" align="center">
        <i
          className="fas fa-coins"
          style={{
            color: "#17bf63"
          }}
        />{" "}
        1200 Points
      </Typography>
    ),
    buttonText: "Pay",
    buttonVariant: "outlined"
  }
];

class BuyPointsSection extends Component {
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="md" component="main" className={classes.content}>
          <Typography
            component="h2"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Buy Points
          </Typography>
        </Container>

        <Container maxWidth="md" component="main" className={classes.container}>
          <Grid container spacing={2} alignItems="flex-end">
            {tiers.map(tier => (
              <Grid item key={tier.title} xs={12} sm={6} md={4}>
                <Card>
                  <CardHeader
                    title={
                      <Typography
                        component="h4"
                        variant="h6"
                        color="textPrimary"
                      >
                        {tier.title}
                      </Typography>
                    }
                    avatar={<Avatar aria-label="logo">{tier.logo}</Avatar>}
                    titleTypographyProps={{ align: "center" }}
                    subheaderTypographyProps={{ align: "center" }}
                    action={<StarIcon />}
                    className={classes.cardHeader}
                  />
                  <CardContent>
                    <div className={classes.cardPricing}>
                      <Typography
                        component="h2"
                        variant="h3"
                        color="textPrimary"
                      >
                        ${tier.price}
                      </Typography>
                    </div>
                    <ul>{tier.description}</ul>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant={tier.buttonVariant}
                      color="primary"
                      onClick={() => {
                        this.props.pay({
                          total: tier.price,
                          points: tier.points
                        });
                      }}
                    >
                      {tier.buttonText}
                      {"    "}
                      <Payment
                        color={`${
                          tier.title === "Silver" ? "action" : "primary"
                        }`}
                      />
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(BuyPointsSection);
