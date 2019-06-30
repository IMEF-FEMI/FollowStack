import React, { Component } from "react";
import compose from "recompose/compose";
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
import withStyles from "@material-ui/core/withStyles";
import SvgIcon from "@material-ui/core/SvgIcon";

import PersonAdd from "@material-ui/icons/PersonAdd";
import Share from "@material-ui/icons/Share";
import StarIcon from "@material-ui/icons/StarBorder";

import Online from "./Online";
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
const tiers = [
  {
    title: "Share Links",
    logo: <Share color="secondary" />,
    price: "Points",
    description: (
      <Typography component="li" variant="subtitle1" align="center">
        {" "}
        40 for every link shared
      </Typography>
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
    price: "Points",
    description: (
      <div>
        <Typography component="li" variant="subtitle1" align="center">
          <i
            className="fab fa-twitter"
            style={{
              color: "#1c88cc"
            }}
          />
          10 for every Like
        </Typography>
        <Typography component="li" variant="subtitle1" align="center">
          <i
            className="fas fa-heart"
            style={{
              color: "#ff3366"
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
  },
  {
    title: "Follow Users",
    logo: <PersonAdd color="secondary" />,
    price: "Points",
    description: (
      <Typography component="li" variant="subtitle1" align="center">
        {" "}
        40 for every user Followed
      </Typography>
    ),
    buttonText: "See Online Users",
    buttonVariant: "contained"
  }
];

class Main extends Component {
  constructor() {
    super();

    this.linksRef = React.createRef();
  }
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
            Earn Points
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textPrimary"
            component="p"
          >
            Go through any of the sections below in order to Gain points. Points
            gained will be used in sharing your tweets to the "Tweets" section.
            which will gain you more Likes/comments/RT's
          </Typography>
        </Container>

        <Container maxWidth="md" component="main">
          <Grid container spacing={5} alignItems="flex-end">
            {tiers.map(tier => (
              // Enterprise card is full width at sm breakpoint
              <Grid
                item
                key={tier.title}
                xs={12}
                sm={tier.title === "Enterprise" ? 12 : 6}
                md={4}
              >
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
                    action={tier.title === "Pro" ? <StarIcon /> : null}
                    className={classes.cardHeader}
                  />
                  <CardContent>
                    <div className={classes.cardPricing}>
                      <Typography
                        component="h2"
                        variant="h4"
                        color="textPrimary"
                      >
                        {tier.price}
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
                        tier.onClick(this.linksRef);
                      }}
                    >
                      {tier.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <div style={{
          paddingTop: "50px"
        }} ref={this.linksRef}>
          <Divider className={classes.logoDivider} />
          <Typography variant="h6" component="h2" gutterBottom align="center">
            Earn points by Sharing our links on your social Media Pages. For
            each link shared, you earn 30 points
          </Typography>
          <ShareLinks />
        </div>
        <div
          style={{
            paddingTop: "60px"
          }}
        >
          <Divider className={classes.logoDivider} />
          <Typography variant="h6" component="h2" gutterBottom align="center">
            You can also earn points by following users currently online. For
            each follow, you earn 40 points, and the user will be notified to
            follow you back
          </Typography>
          <Online />
        </div>
      </React.Fragment>
    );
  }
}
export default compose(withStyles(styles))(Main);
