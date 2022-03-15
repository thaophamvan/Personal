import React from 'react';
import PropTypes from 'prop-types';
import ShareLink from './ShareLink';

const propTypes = {
  shareLink: PropTypes.string,
};

const defaultProps = {
  shareLink: '',
};

const Twitter = ({ shareLink }) => (
  <ShareLink shareLink={shareLink} provider="twitter" target="_blank" text="Twitter" />
);

Twitter.propTypes = propTypes;
Twitter.defaultProps = defaultProps;

export default Twitter;
