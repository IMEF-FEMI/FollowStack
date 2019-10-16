import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import PeaButton from '../../components/profile/PeaButton';
import PeaIcon from '../../components/profile/PeaIcon';
import PeaAvatar from '../../components/profile/PeaAvatar';
import PeaStatistic from '../../components/profile/PeaStatistic';
import PeaText from '../../components/profile/PeaTypography';

import theme from "../../components/profile/theme";
import ThemeProvider from "@material-ui/styles/ThemeProvider"; 

import withStyles from "@material-ui/core/styles/withStyles";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Tab from '@material-ui/core/Tab/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';
import {ClapSpinner}  from "react-spinners-kit"; 

import {connect} from 'react-redux'


import profilePageStyle from "../../../assets/jss/material-kit-react/views/profilePage.jsx";


import MyTweets from "./MyTweets"

import {deleteUser} from "../../../../../async/auth";
import { logoutUser} from "../../../../../actions/authActions";



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});


class Main extends React.Component{
 state ={
      confirmed: false,
      deleteButtonLoad: false,
      classicModal: false,
      index: 0
    }
    formatCount(count) {
        const readablize = num => {
          var e = Math.floor(Math.log(num) / Math.log(1000));
          return (num / Math.pow(1000, e)).toFixed(1) + "K";
        };

      if (count > 999) return readablize(count);
      else return count;
    }
     
  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose(modal) {
    var x = [];
    x[modal] = false;
    this.setState(x, ()=>{
    this.setState({confirmed: false, deleteButtonLoad: false})

    });
  }
  handleConfirmDelete = async()=>{
    this.setState({confirmed:true})
    const res = await deleteUser()
    if (res.data.success) {
      this.props.logoutUser()
    }
  }
  onChange = (index)=>{
    this.setState({index: index})
  }

render() {
    const { classes} = this.props;
     const { userProfile } = this.props.auth;

      const {
      twitter_location,
      } = this.props
  return (
 <ThemeProvider theme={theme}>
    <Card className={'PeaFullProfile-root'}>
      <CardMedia className={'MuiCardMedia-root'} image={userProfile.background_photo} />
      <CardContent className={'MuiCardContent-root'}>
        <Grid container justify={'space-between'} spacing={2} wrap={'nowrap'}>
          <Grid item>
              <PeaAvatar className={'MuiAvatar-root-profilePic'} src={userProfile.photo} />
          </Grid>
          <Hidden only={'xs'}>
            <Grid item>
              <PeaStatistic style={{color: "#788898"}} label={'Tweets'} value={userProfile.tweets} />
            </Grid>
            <Grid item>
              <PeaStatistic label={'Following'} value={userProfile.following} />
            </Grid>
            <Grid item>
              <PeaStatistic label={'Followers'} value={userProfile.followers} />
            </Grid>
          </Hidden>
          <Grid item>
            <PeaButton
              size={'small'}
              variant={'outlined'}
              labelExpanded={false}
              icon={'delete'}
              iconProps={{
                color: 'danger',
                size: 'small',
              }}
              loading={this.state.deleteButtonLoad}

              style={{ marginTop: 6 }}
              onClick={() => {this.handleClickOpen("classicModal")
                this.setState({deleteButtonLoad: true})
            }}
            >
              Delete Account
            </PeaButton>
          </Grid>
          <Grid item>
            <IconButton >
              <PeaIcon>more_vert</PeaIcon>
            </IconButton>
          </Grid>
        </Grid>
        <Hidden smUp>
          <Grid container justify={'space-evenly'} style={{ marginTop: -32 }}>
            <Grid item>
              <PeaStatistic label={'Twwets'} value={userProfile.tweets} />
            </Grid>
            <Grid item>
              <PeaStatistic label={'Following'} value={userProfile.following} />
            </Grid>
            <Grid item>
              <PeaStatistic label={'Followers'} value={userProfile.followers} />
            </Grid>
          </Grid>
          <br />
        </Hidden>
        <Hidden only={'xs'}>
          <div style={{ marginTop: -32 }} />
        </Hidden>
        <PeaText variant={'h5'} weight={'bold'}>
          {userProfile.name}
        </PeaText>
        <PeaText gutterBottom>{`@${userProfile.screen_name}`}</PeaText>
        <PeaText>
          <Link
            color={'primary'}
            href={`https://twitter.com/${userProfile.screen_name}`}
            target={'_blank'}
            rel={'noopener'}
          >
            Twitter Profile
          </Link>
        </PeaText>
        <br />
        <Grid container wrap={'nowrap'} spacing={1}>
          <Grid item>
            <PeaIcon color={'secondary'} size={'small'}>
              info
            </PeaIcon>
          </Grid>
          <Grid item>
            <PeaText gutterBottom>{userProfile.description}</PeaText>
          </Grid>
        </Grid>
        <Grid container wrap={'nowrap'} spacing={1}>
          <Grid item>
            <PeaIcon color={'secondary'} size={'small'}>
              location_on
            </PeaIcon>
          </Grid>
          <Grid item>
            <PeaText gutterBottom>{twitter_location}</PeaText>
          </Grid>
        </Grid>
        <br />
        <PeaText gutterBottom variant={'subtitle1'} weight={'bold'}>
          User Activity
        </PeaText>
          <PeaText underline={'none'}>
            <b>Points: </b> {this.props.auth.points}
          </PeaText>
          
          <PeaText underline={'none'}>
            <b>Tweets Shared: </b> {this.props.myProfile.shareTweetsCount}
          
        </PeaText>
        <Tabs
        className={'MuiTabs-root'}
        variant={'fullWidth'}
        centered
        value={this.state.index}
        onChange={(e, val) => this.onChange(val)}
      >
        <Tab label="My Tweets" disableRipple />
        <Tab label="Shared Tweets" disableRipple />
      </Tabs>
        
      <MyTweets/>
        <PeaText gutterBottom />
        <Dialog
            classes={{
              root: classes.center,
              paper: classes.modal
            }}
            open={this.state.classicModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => this.handleClose("classicModal")}
            aria-labelledby="classic-modal-slide-title"
            aria-describedby="classic-modal-slide-description"
          >
            <DialogTitle
              id="classic-modal-slide-title"
              disableTypography
              className={classes.modalHeader}
            >
              <IconButton
                className={classes.modalCloseButton}
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={() => this.handleClose("classicModal")}
              >
                <Close className={classes.modalClose} />
              </IconButton>
              <h4 className={classes.modalTitle}>Confirm Action</h4>
            </DialogTitle>
            <DialogContent
              id="classic-modal-slide-description"
              className={classes.modalBody}
            >
             { !this.state.confirmed &&
              (<p style={{
                  fontSize: "32px"
                }}>
                  Are you sure You want to Delete this Account?
                </p>)}
                      {this.state.confirmed &&
                         (
                          <Grid container justify="center" style={{marginTop: "65px"}}>
                          <ClapSpinner
                            size={70}
                            color="#686769"
                            loading={this.state.confirmed}
                        /> </Grid>)

                      }
                      </DialogContent>
                {!this.state.confirmed &&
                 (<DialogActions className={classes.modalFooter}>
                    <Button variant="outlined" onClick={this.handleConfirmDelete}>
                      Yes
                    </Button>
                    <Button
                      onClick={() => this.handleClose("classicModal")}
                      color="secondary"
                      variant="outlined"
                    >
                      No
                    </Button>
                  </DialogActions>)}
                  </Dialog>
                
      </CardContent>
    </Card>
  </ThemeProvider>
  );
};
}

Main.propTypes = {
  twitter_location: PropTypes.string,
  age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gender: PropTypes.string,
  
};
Main.defaultProps = {
  twitter_location: '',
  age: 'unknown',
  gender: 'unknown',
};
const mapStateToProps = state => ({
    auth: state.auth,
    myProfile: state.myProfile
  });
  export default connect(
    mapStateToProps, {logoutUser}
  )(withStyles(profilePageStyle)(Main));

