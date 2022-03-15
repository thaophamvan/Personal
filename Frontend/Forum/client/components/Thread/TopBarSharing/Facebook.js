import React from 'react';
import PropTypes from 'prop-types';
import ShareLink from './ShareLink';

const propTypes = {
  shareLink: PropTypes.string,
};

const defaultProps = {
  shareLink: '',
};

const Facebook = ({ shareLink }) => (
  <ShareLink shareLink={shareLink} provider="facebook" target="_blank" />
);

Facebook.propTypes = propTypes;
Facebook.defaultProps = defaultProps;

export default Facebook;
