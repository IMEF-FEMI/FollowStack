/**
 * Follow predefined Button v1.1
 */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import MuiButton from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from './PeaIcon';
import theme from "../profile/theme";
import ThemeProvider from "@material-ui/styles/ThemeProvider"; 


const getLoaderSize = size => {
  if (size === 'small') return 16;
  if (size === 'big') return 28;
  if (size === 'large') return 36;
  return 20;
};

const injectColor = color => {
  if (
    color === 'inherit' ||
    color === 'primary' ||
    color === 'secondary' ||
    color === 'red' ||
    color === 'default'
  ) {
    return color;
  }
  return undefined;
};

const PeaButton = ({
  className,
  classes,
  color,
  inverted,
  loading,
  elongated,
  size,
  shape,
  compact,
  shadowless,
  labelExpanded,
  mobileFullWidth,
  icon,
  iconIsolated,
  iconProps,
  iconPosition,
  children,
  loaderProps,
  ...props
}) => {
  const iconComponent =
    typeof icon === 'string' ? <Icon {...iconProps}>{icon}</Icon> : icon;
  const loaderSize = getLoaderSize(size);
  const renderChildren = () =>
    icon ? <span className={'MuiButton-span'}>{children}</span> : children;
  return (
 <ThemeProvider theme={theme}>
    <MuiButton
      classes={{
        root: cx('MuiButton-root', classes.root),
        label: cx(
          'MuiButton-label',
          iconIsolated && '-icon-isolated',
          classes.label,
        ),
        disabled: cx('MuiButton-disabled', classes.disabled),
      }}
      className={cx(
        className,
        inverted && '-inverted',
        loading && '-loading',
        elongated && '-elongated',
        color && `-color-${color}`,
        size && `-size-${size}`,
        shape && `-shape-${shape}`,
        labelExpanded && '-labelExpanded',
        mobileFullWidth && '-mobileFullWidth',
        shadowless && '-shadowless',
        compact && '-compact',
      )}
      color={injectColor(color)}
      {...props}
    >
      {loading && (
        <CircularProgress
          thickness={6}
          {...loaderProps}
          size={loaderSize}
          style={{
            marginLeft: -loaderSize / 2,
            marginTop: -loaderSize / 2,
          }}
          className={'MuiButton-loader'}
        />
      )}
      {icon && iconPosition === 'start' && iconComponent}
      {shape !== 'circular' && renderChildren()}
      {icon && iconPosition === 'end' && iconComponent}
    </MuiButton>
    </ThemeProvider>
  );
};

PeaButton.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.shape({}),
  color: PropTypes.oneOf([
    'default',
    'inherit',
    'primary',
    'secondary',
    'red',
    'danger',
  ]),
  compact: PropTypes.bool,
  inverted: PropTypes.bool,
  loading: PropTypes.bool,
  elongated: PropTypes.bool,
  labelExpanded: PropTypes.bool,
  mobileFullWidth: PropTypes.bool,
  shadowless: PropTypes.bool,
  size: PropTypes.oneOf(['small', '', 'big', 'large']),
  shape: PropTypes.oneOf(['', 'chubby', 'circular', 'square', 'rectangle']),
  children: PropTypes.node.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  iconIsolated: PropTypes.bool,
  iconPosition: PropTypes.oneOf(['start', 'end']),
  iconProps: PropTypes.shape({}),
  loaderProps: PropTypes.shape({}),
};
PeaButton.defaultProps = {
  className: '',
  classes: {},
  color: 'default',
  compact: false,
  inverted: false,
  loading: false,
  elongated: false,
  labelExpanded: false,
  mobileFullWidth: false,
  shadowless: true,
  size: '',
  shape: 'chubby',
  icon: '',
  iconIsolated: false,
  iconPosition: 'start',
  iconProps: {},
  loaderProps: {},
};
export default PeaButton;
