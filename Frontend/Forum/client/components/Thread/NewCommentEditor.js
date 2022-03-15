import React from 'react';

import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

const NewCommentEditor = ({ className }) => (
  <div className={`${className}`}>
    Admin Panel
  </div>
);

NewCommentEditor.propTypes = propTypes;
NewCommentEditor.defaultProps = defaultProps;

export default NewCommentEditor;
