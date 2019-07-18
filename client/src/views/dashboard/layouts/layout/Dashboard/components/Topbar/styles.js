export default theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.border}`,
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
    height: '64px',
    zIndex: theme.zIndex.appBar
  },
  toolbar: {
    minHeight: 'auto',
    width: '100%'
  },
  title: {
    marginLeft: theme.spacing(),
    color: "#66788A",
    fontWeight: '500',
    fontSize: '20px',
    letterSpacing: '-0.06px',
    lineHeight: '24px'
  },
  menuButton: {
    marginLeft: '-4px'
  },
  refreshButton: {
    marginRight: 'auto',
    color: "#66788A"
  },
  signOutButton: {
    // marginLeft: theme.spacing(),
    marginLeft: 'auto'

  }
});
