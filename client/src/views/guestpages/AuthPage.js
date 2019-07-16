import React, {Component} from 'react'
import Typography from "@material-ui/core/Typography"
import qs from 'query-string'
import axios from 'axios'
import { SocketContext } from "../../components/SocketContext";
import { initSignIn } from "../../components/Init";
import {compose} from 'redux'
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {ClapSpinner}  from "react-spinners-kit"; 
import { checkUser } from "../../async/auth";
import { initGA, trackPage } from "../../components/Tracking";
import withStyles from "@material-ui/core/styles/withStyles";

import {
  signIn,
  setUserData,
  setUserProfileData,
} from "../../actions/authActions";


const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
    borderRadius: "10px"
  }
});

class AuthPage extends Component{
	state = {
		user: {}
	}
	componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.setUserData(this.state.user);
      this.props.history.push("/shared-tweets");
    }
  }
	async componentWillMount (){
		if (this.props.auth.isAuthenticated === true) {
      this.props.history.push("/shared-tweets");
    }
		// track page G-A
		const page = this.props.location.pathname + this.props.location.search;
	    initGA();
	    trackPage(page);
		const query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
	if (query.oauth_token === localStorage.getItem("oauthRequestToken")) {
		try{
			const keyRes = await axios.get(`/auth/callback/twitter/${localStorage.getItem("keyInUse")}/${localStorage.getItem("oauthRequestToken")}/${localStorage.getItem("oauthRequestTokenSecret")}/${query.oauth_verifier}`)
			const keys = keyRes.data

			if (keyRes.data.oauthAccessToken) {
				const userRes = await axios.get(`/auth/verify/twitter/${localStorage.getItem("keyInUse")}/${keyRes.data.oauthAccessToken}/${keyRes.data.oauthAccessTokenSecret}`)
				const {user} = userRes.data

				// check if user exists in db or not
					const res = await checkUser(user.id_str);
			      if (res.data === false) {
			      		//resgister user
			      	const userData = {
			          	accessToken: keys.oauthAccessToken,
	            		secret: keys.oauthAccessTokenSecret,
	            		userid: user.id_str,
			            username: user.screen_name,
			            photo: user.profile_image_url_https.replace("_normal", ""),
			          }
			      	this.props.history.push({
				        pathname: "/complete-signup",
				        state: {
				          user: userData
				        }
				      });
			      } else {
			        try {
			          //sign in
			          const userData = {
			          	accessToken: keys.oauthAccessToken,
	            		secret: keys.oauthAccessTokenSecret,
	            		userid: user.id_str,
			            username: user.screen_name,
			            photo: user.profile_image_url_https.replace("_normal", ""),
			          }
			            this.setState({user: userData})
			           await this.props.setUserProfileData(
			              {name: user.name,
	  			          screen_name: user.screen_name,
	  			          description: user.description,
	  			          followers: user.followers_count,
	  			          following: user.friends_count,
	  			          background_photo: user.profile_background_image_url_https,
	  			          photo: user.profile_image_url_https.replace("_normal", ""),
	  			          tweets: user.statuses_count}
			            );
			         await this.props.signIn(userData);
			          initSignIn(this.props.socket)
			        } catch (err) {
			        	console.log(err)
			        	// return authentication error to sign-in page
			        }
			      }

			}

		}catch(err){
		this.props.history.push({
        pathname: "/sign-in",
        state: {
          error: "Authentication Failed Try Again"
        }
      });
		}


	}else{
		// authentication error
		this.props.history.push({
	        pathname: "/sign-in",
	        state: {
	          error: "Authentication Failed Try Again"
	        }
	      });
		}
	}

	



	render(){
		const {classes} = this.props
		return(
		<div
        style={{
          backgroundColor: "#2c3e50",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          height: "100vh"
        }}
      >
        <main className={classes.main}>
          <CssBaseline />
          <div
            style={{
              paddingTop: "15vh"
            }}
          >
            <Paper className={classes.paper}>
              <React.Fragment>
    
              <Grid container justify="center" style={{marginTop: "65px", marginBottom: "65px"}}>
              <ClapSpinner
                size={70}
                color="#686769"
                loading={true}/> 
                </Grid>
              </React.Fragment>

              <React.Fragment>
                <Typography align="center" variant="h4">
                 Please wait While we Authenticate you
                </Typography>
              </React.Fragment>
            </Paper>
          </div>
        </main>
      </div>
		)
	}
}

const mapStateToProps = state => ({
  auth: state.auth
});
const AuthPageWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <AuthPage {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default compose(
connect(mapStateToProps,{
	signIn,
	setUserData,
	setUserProfileData,
}),
 withStyles(styles)
)(AuthPageWithSocket)