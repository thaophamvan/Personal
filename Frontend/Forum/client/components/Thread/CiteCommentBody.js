import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};

const defaultProps = {
  text: '',
  className: PropTypes.string,
};


const CiteCommentBody = ({ text, className }) => (
  <div className={className}>
    <cite className="bn_thread-comment__cite">{text}</cite>
  </div>
);

CiteCommentBody.propTypes = propTypes;
CiteCommentBody.defaultProps = defaultProps;

export default CiteCommentBody;
