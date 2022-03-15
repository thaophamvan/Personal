import React from 'react';

import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  showMobileOnly: PropTypes.bool,
  onClick: PropTypes.func,
};

const defaultProps = {
  className: '',
  showMobileOnly: false,
  onClick: () => {},
};

const StarButton = ({ className, showMobileOnly, onClick }) => {
  const computedStyle = showMobileOnly ? 'show-mobile' : '';
  return (
    <a className={` bn_box__icon material-icons ${computedStyle}`}>
      grade
    </a>
  );
};

StarButton.propTypes = propTypes;
StarButton.defaultProps = defaultProps;

export default StarButton;
