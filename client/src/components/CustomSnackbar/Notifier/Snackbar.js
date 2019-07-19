import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import classNames from "classnames";
import Avatar from "@material-ui/core/Avatar";


const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 400,
        minWidth: 344,
    },
    typography: {
        color: "#fff"
    },
    actionRoot: {
        padding: '8px 8px 8px 16px',
        backgroundColor: '#43a047',
    },
    icons: {
        marginLeft: 'auto',
    },
    close: {
        padding: '8px 8px',
        color: "#fff",
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
     icon: {
        fontSize: 20
      },
      iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing()
      },
}));

const SnackMessage = React.forwardRef((props, ref) => {
    const classes = useStyles();
    const {variant, user} = props
    

    return (
        <Card className={classes.card} ref={ref}>
            <CardActions classes={{ root: classes.actionRoot }}>
             <Avatar src={user.photo}
                    className={classNames(classes.icon, classes.iconVariant)}
                  />

                <Typography variant="subtitle2" className={classes.typography}>
                    {variant === "online" && (`${user.screen_name } Just came online`)}
                    {variant === "followed" && (`${user.screen_name }Just followed you`)}
                    {variant === "followedback" && (`${user.screen_name } Just followed you back`)}
                    {variant === "followingback" && (` you are now following ${user.screen_name}`)}
                </Typography>
                <div className={classes.icons}>
                    
                    <IconButton className={classes.close} onClick={props.handleDismiss}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </CardActions>
        </Card>
    );
});

SnackMessage.propTypes = {
    id: PropTypes.number.isRequired,
};

export default SnackMessage;