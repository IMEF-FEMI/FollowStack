import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import PeaIcon from './PeaIcon';
import EmojiIcon from './peapods-logo-circle.svg';
// import Face from "@material-ui/icons/Face"

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  icon: {
    width: 24,
    height: 28,
    cursor: 'pointer',
    color: '#B7B6BC',
    '&:hover': {
      opacity: 0.8,
    },
  },
  inputRoot: {
    borderRadius: 40,
    minHeight: "40px",
    backgroundColor: '#F2F2F4',
    padding: '5px 10px',
    '& input': {
      fontSize: 14,
      paddingLeft: 10,
    },
  },
  fileInput: {
    display: 'none',
  },
}));

const noop = () => false;

const PeaMessageInput = ({
  value,
  onChange,
  onFileChange,
  onSubmit,
  accept,
  multiple,
  onUpload,
}) => {
  const classes = useStyles();
  const [inputValue, onInputChange] = useState(value);
  const [showEmoji, setShowEmoji] = useState(false);

  const handleChange = e => {
    const { value: v } = e.target;
    onInputChange(v);
    onChange(v);
  };
  const toggleEmoji = () => setShowEmoji(!showEmoji);
  const handleSubmit = () => onSubmit(value);
  const onEmojiSelect = e => {
    handleChange({
      target: {
        value: inputValue + e.native,
      },
    });
  };

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      classes={{ container: classes.root }}
    >
      {showEmoji && (
        <ClickAwayListener onClickAway={toggleEmoji}>
          <Grid item xs={12}>
            <Picker
              set="emojione"
              style={{
                width: '100%',
                left: 0,
              }}
              showPreview={false}
              showSkinTones={false}
              onSelect={onEmojiSelect}
            />
          </Grid>
        </ClickAwayListener>
      )}
      <Grid item>
        <label htmlFor="pea-message-input-upload">
          
          <Input 
            className={classes.fileInput}
            id="pea-message-input-upload"
             type="file"
            accept={accept}
            multiple={multiple}
            onChange={onFileChange}
            />
          <PeaIcon icon="fas fa-paperclip" className={classes.icon} />
        </label>
      </Grid>
      <Grid item classes={{ item: classes.flex }} container>
        <Input
          fullWidth
          disableUnderline
          classes={{ root: classes.inputRoot }}
          margin="none"
          variant="outlined"
          onChange={handleChange}
          value={inputValue}
          placeholder="Whats Happening. . ."
          multiline
          endAdornment={
            <InputAdornment position="end" onClick={toggleEmoji}>
              {!showEmoji ? (
                <img
                  src={EmojiIcon}
                  alt="emoji-picker"
                  className={classes.icon}
                />
              ) : (
                <PeaIcon
                  icon="fas fa-times-circle"
                  alt="emoji-picker-close"
                  className={classes.icon}
                />
              )}
            </InputAdornment>
          }
        />
      </Grid>
      <Grid item>
        <Button variant="contained"size="small" style={{
          borderRadius: "15px"
        }} onClick={handleSubmit} >
          Tweet
        </Button>
      </Grid>
    </Grid>
  );
};

PeaMessageInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFileChange: PropTypes.func,
  onUpload: PropTypes.func,
  onSubmit: PropTypes.func,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
};
PeaMessageInput.defaultProps = {
  value: '',
  onChange: noop,
  onUpload: noop,
  onSubmit: noop,
  accept: 'image/*, video/*',
  multiple: true,
};
PeaMessageInput.metadata = {
  name: 'Whats Happening...',
};
PeaMessageInput.getTheme = () => ({
  'Mui{Component}': {
    // this object will be injected to 'overrides' section
    root: {},
    // ...
  },
});

export default PeaMessageInput;
