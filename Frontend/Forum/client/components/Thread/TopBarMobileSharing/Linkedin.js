import React from 'react';
import PropTypes from 'prop-types';
import ShareLink from './ShareLink';

const propTypes = {
  shareLink: PropTypes.string,
};

const defaultProps = {
  shareLink: '',
};

const Linkedin = ({ shareLink }) => (
  <ShareLink shareLink={shareLink} provider="linkedin" target="_blank" text="Linkedin" />
);

Linkedin.propTypes = propTypes;
Linkedin.defaultProps = defaultProps;

export default Linkedin;
