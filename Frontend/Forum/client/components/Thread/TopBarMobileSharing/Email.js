import React from 'react';
import PropTypes from 'prop-types';
import ShareLink from './ShareLink';

const propTypes = {
  shareLink: PropTypes.string,
};

const defaultProps = {
  shareLink: '',
};

const Email = ({ shareLink }) => (
  <ShareLink shareLink={shareLink} provider="email" target="_self" text="Email" />
);

Email.propTypes = propTypes;
Email.defaultProps = defaultProps;

export default Email;
