import React from 'react';

import PropTypes from 'prop-types';
import { linkify, removeFirstLastEmptyParagraphs } from '../../utilities';

const propTypes = {
  className: PropTypes.string,
  Subject: PropTypes.string,
  Body: PropTypes.string,
};

const defaultProps = {
  className: '',
  Subject: '',
  Body: '',
};

const MainTopicBody = ({ className, Subject, Body }) => (
  <div className="bn_thread-body">
    <h1 className="bn_thread-body__title">{Subject}</h1>
    <div
      className="textArea bn_thread-body__text"
      dangerouslySetInnerHTML={{
        __html: linkify(removeFirstLastEmptyParagraphs(Body)),
      }}
    />
  </div>
);

MainTopicBody.propTypes = propTypes;
MainTopicBody.defaultProps = defaultProps;

export default MainTopicBody;
