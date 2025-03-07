import React, { Component } from "react";
import compose from "recompose/compose";
import { withRouter } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import withStyles from "@material-ui/core/styles/withStyles";
import SvgIcon from "@material-ui/core/SvgIcon";

import Share from "@material-ui/icons/Share";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import StarIcon from "@material-ui/icons/StarBorder";

// import Online from "./Online";
import ShareLinks from "./ShareLinks";

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
const twitterSvg = (
  <SvgIcon
    style={{
      color: "rgb(28, 136, 204)"
    }}
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </SvgIcon>
);
const sections = [
  {
    title: "Twitter Links",
    logo: <Share color="secondary" />,
    header: "Points",
    description: (
      <div>
        <Typography component="li" variant="subtitle1" align="center">
          {"You earn"}
        </Typography>
        <Typography component="li" variant="subtitle1" align="center">
          {" "}
          50 When you Follow us
        </Typography>
        <Typography component="li" variant="subtitle1" align="center">
          {" "}
          50 for every link shared
        </Typography>
      </div>
    ),
    buttonText: "Share Links",
    buttonVariant: "contained",
    onClick: function(contentRef) {
      contentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
  },
  {
    title: "Engage Tweets",
    logo: twitterSvg,
    header: "Points",
    pathName: "/shared-tweets",
    description: (
      <div>
        <Typography component="li" variant="subtitle1" align="center">
          <i
            className="fas fa-heart"
            style={{
              color: "#ff3366"
            }}
          />
          10 for every Like
        </Typography>
        <Typography component="li" variant="subtitle1" align="center">
          <i
            className="fas fa-comment"
            style={{
              color: "#1c88cc"
            }}
          />
          20 for every comment
        </Typography>
        <Typography component="li" variant="subtitle1" align="center">
          <i
            className="fas fa-retweet"
            style={{
              color: "#17bf63"
            }}
          />{" "}
          30 for every Retweet
        </Typography>
      </div>
    ),

    buttonText: "View Shared Tweets",
    buttonVariant: "contained"
  }
];

class Main extends Component {
  constructor() {
    super();

    this.linksRef = React.createRef();
  }
  push = url => {
    this.props.history.push(url);
  };
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="md" component="main" className={classes.content}>
          <Typography
            variant="h4"
            component="h6"
            gutterBottom
            align="center"
            color="secondary"
          >
            Sorry You don't have enough points for that action
          </Typography>
          <Typography
            component="h2"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Earn Points
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textPrimary"
            component="p"
          >
            Go through any of the sections below in order to Earn points. Points
            earned will be used in sharing your tweets to the "Tweets" section.
            which will earn you more Likes/comments/RT's
          </Typography>
        </Container>

        <Container maxWidth="md" component="main">
          <Grid container spacing={2} justify="center">
            {sections.map(section => (
              <Grid item key={section.title} xs={12} sm={6} md={4}>
                <Card>
                  <CardHeader
                    title={
                      <Typography
                        component="h4"
                        variant="h6"
                        color="textPrimary"
                      >
                        {section.title}
                      </Typography>
                    }
                    avatar={<Avatar aria-label="logo">{section.logo}</Avatar>}
                    titleTypographyProps={{ align: "center" }}
                    subheaderTypographyProps={{ align: "center" }}
                    action={section.title === "Pro" ? <StarIcon /> : null}
                    className={classes.cardHeader}
                  />
                  <CardContent>
                    <div className={classes.cardPricing}>
                      <Typography
                        component="h2"
                        variant="h4"
                        color="textPrimary"
                      >
                        {section.header}
                      </Typography>
                    </div>
                    <ul>{section.description}</ul>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant={section.buttonVariant}
                      color="primary"
                      onClick={() => {
                        if (section.title === "Share Links") {
                          section.onClick(this.linksRef);
                        } else {
                          this.push(section.pathName);
                        }
                      }}
                    >
                      {section.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <div
          style={{
            paddingTop: "50px"
          }}
          ref={this.linksRef}
        >
          <Typography variant="h4" component="h6" gutterBottom align="center">
            Share Our Link Your Twitter And / Or Follow us
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom align="center">
            Note: You can share as many as you like and earn more points
          </Typography>
          <ShareLinks />
        </div>
        <div
          style={{
            paddingTop: "60px",
            paddingBottom: "60px"
          }}
        >
          <Divider className={classes.logoDivider} />
          <Typography variant="h6" component="h2" gutterBottom align="center">
            Alternatively, you can Buy points
          </Typography>
          <Grid container justify="center">
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  this.push("/buy-points");
                }}
              >
                <ShoppingCart /> Buy Points
              </Button>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}
export default compose(
  withRouter,
  withStyles(styles)
)(Main);
