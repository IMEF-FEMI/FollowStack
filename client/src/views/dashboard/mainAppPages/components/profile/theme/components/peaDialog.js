/* eslint-disable max-len */
export default ({ spacing, breakpoints, white, palette }) => ({
  MuiDialog: {
    root: {
      '&.PeaPodDialog': {
        '& .PeaCounter-root': {
          marginTop: spacing(1),
        },
      },
      '&.PeaDialog': {
        '& .DialogTitle--contained + .DialogContent--root': {
          paddingTop: 24,
        },
        '& .DialogTitle--secondaryCentered': {
          '& h6': {
            color: palette.secondary.main,
            fontWeight: 'bold',
            textAlign: 'center',
          },
        },
        '& .DialogCloseButton': {
          position: 'absolute',
          padding: 4,
          background: palette.text.hint,
          color: palette.common.white,
          top: 16,
          right: 16,
          '& .material-icons': {
            fontSize: 20,
          },
          '&:hover': {
            background: palette.text.secondary,
          },
        },
        '& .DialogContent--root': {
          maxWidth: 400,
          minWidth: 343,
        },
        '& .DialogActions-root': {
          marginBottom: spacing(2),
          justifyContent: 'center',
        },
      },
      '&.PeaInvitationDialog': {
        '& .DialogContent--root': {
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 8,
          minWidth: 343,
        },
        '& .ListSubheader-typography': {
          color: palette.secondary.main,
          fontWeight: 'bold',
          paddingLeft: spacing(2),
        },
        '& .ListItem-secondaryErrorText': {
          color: palette.error.main,
        },
      },
      '&.PeaDialog.PeaEventDialog': {
        '& .DialogContent--root': {
          maxWidth: 600,
          minWidth: 343,
        },
      },
    },
    paper: {
      borderRadius: 16,
      [breakpoints.only('xs')]: {
        margin: spacing(2),
      },
    },
  },
  MuiDialogTitle: {
    root: {
      '&.DialogTitle--contained': {
        padding: 16,
        background:
          'linear-gradient(90deg, rgba(92,199,153,1), rgba(0,255,176,1))',
        '& *': {
          color: white.text,
          textAlign: 'center',
        },
      },
    },
  },
});
