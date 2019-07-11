  /*!

  =========================================================
  * Material Kit React - v1.7.0
  =========================================================

  * Product Page: https://www.creative-tim.com/product/material-kit-react
  * Copyright 2019 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/material-kit-react/blob/master/LICENSE.md)

  * Coded by Creative Tim

  =========================================================

  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  */
  import React from "react";
  // nodejs library to set properties for components
  import PropTypes from "prop-types";
  // nodejs library that concatenates classes
  import classNames from "classnames";

  // @material-ui/core components
  import withStyles from "@material-ui/core/styles/withStyles";
  import Typography from "@material-ui/core/Typography"
  import Grid from "@material-ui/core/Grid"
  import Button from "@material-ui/core/Button"
  import DeleteForever from "@material-ui/icons/DeleteForever"
  import Close from "@material-ui/icons/Close";
  import Collapse from "@material-ui/core/Collapse";
  import Slide from "@material-ui/core/Slide";
  import IconButton from "@material-ui/core/IconButton";
  import Dialog from "@material-ui/core/Dialog";
  import DialogTitle from "@material-ui/core/DialogTitle";
  import DialogContent from "@material-ui/core/DialogContent";
  import DialogActions from "@material-ui/core/DialogActions";
  import {ClapSpinner}  from "react-spinners-kit"; 

  import {connect} from 'react-redux'

  import GridContainer from "../../components/Grid/GridContainer.jsx";
  import GridItem from "../../components/Grid/GridItem.jsx";
  import Parallax from "../../components/Parallax/Parallax.jsx";

  import profilePageStyle from "../../../assets/jss/material-kit-react/views/profilePage.jsx";


  import MyTweets from "./MyTweets"



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});



  class ProfilePage extends React.Component {
    state ={
      expanded:false,
      confirmed: false,
      classicModal: false
    }
    handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };
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
    this.setState({confirmed: false})
    });
  }
  handleConfirmDelete =()=>{
    this.setState({confirmed:true})

  }

    render() {
      const { classes} = this.props;
      const imageClasses = classNames(
        classes.imgRaised,
        classes.imgRoundedCircle,
        classes.imgFluid
      );

      const { userProfile } = this.props.auth;

      return (
        <div>
          <Parallax small filter image={userProfile.background_photo} />
          <div className={classNames(classes.main, classes.mainRaised)}>
            <div className={classes.name}>
              <div className={classes.container}>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={6}>
                    <div className={classes.profile}>
                      <div>
                        <img src={userProfile.photo} alt="..." className={imageClasses} />
                      </div>
                      <div>
                      <Typography
                          component="h2"
                          variant="h3"
                          color="textPrimary"
                        >
                          {userProfile.name}
                        </Typography>
                        <Typography className={classes.nameText} variant="h6">
                        {userProfile.screen_name}
                      </Typography>
                       <Grid container justify="center" spacing={2}>
                        <Grid item>
                          {
                            <h3>
                              <b> {`${userProfile.tweets} `}</b>Tweets
                            </h3>
                          }
                        </Grid>
                        <Grid item>
                          <h3 >
                            <b>{this.formatCount(userProfile.followers)}</b>{"  "}
                            followers
                          </h3>
                        </Grid>
                        <Grid item>
                          <h3>
                            <b>{this.formatCount(userProfile.following)}</b>{"  "}
                            following
                          </h3>
                        </Grid>
                      </Grid>
                    
                    </div>
                    </div>
                  </GridItem>
                </GridContainer>
                <Grid container justify="center" spacing={4}>
                  <Grid item xs={12}>
                    {
                      <Typography className={classes.nameText} align="center" variant="h6">
                        {`${userProfile.description} `}
                      </Typography>
                    }
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" onClick={this.handleExpandClick}>
                        User Account Details
                     </Button> 
                     </Grid>
                   </Grid>


                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                   <Grid container justify="center" spacing={2}>
                    <Grid item>
                      <h3>
                        <b>{this.props.auth.points}</b>{"  "}
                        Points
                      </h3>
                    </Grid>
                    <Grid item>
                      <h3>
                        <b>{this.props.myProfile.shareTweetsCount}</b>{"  "}
                        Tweets shared
                      </h3>
                    </Grid>
                    </Grid>
                    <Grid container justify="center" >
                      <Button variant="contained" size="small" color="secondary"
                        onClick={() => this.handleClickOpen("classicModal")}
                      >
                      <DeleteForever/>
                       Delete Account
                     </Button> 
                 </Grid>
               </Collapse>

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
                
                  </div>
                  <MyTweets/>
            </div>
          </div>
        </div>
      );
    }
  }

  ProfilePage.propTypes = {
    classes: PropTypes.object,
  };
  const mapStateToProps = state => ({
    auth: state.auth,
    myProfile: state.myProfile
  });
  export default connect(
    mapStateToProps,
  )(withStyles(profilePageStyle)(ProfilePage));
