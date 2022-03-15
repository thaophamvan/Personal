import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  isVisible: PropTypes.bool,
};

const defaultProps = {
  isVisible: false,
};

const ActivateLink = ({ isVisible }) => {
  if (isVisible) {
    return (
      <a
        className="bn_header-setting__link bn_header-setting__link--unentitled"
        id="activationLink"
        href="/Pages/ActivateUser.aspx"
        target="_top"
      >Aktivera Börssnack</a>
    );
  }
  return null;
};
ActivateLink.propTypes = propTypes;
ActivateLink.defaultProps = defaultProps;

export default ActivateLink;
