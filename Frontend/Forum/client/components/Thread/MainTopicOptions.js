import React from 'react';
import PropTypes from 'prop-types';

import { VisiblityByAccess } from '../share';

import './MainTopicOptions.scss';

const propTypes = {
  commentClicked: PropTypes.func,
  hasAccess: PropTypes.bool,
};

const defaultProps = {
  commentClicked: () => { },
  hasAccess: false,
};

const MainTopicOptions = ({ commentClicked, hasAccess }) => (
  <VisiblityByAccess hasAccess={hasAccess} className="bn_thread-comment__options">
    <a
      role="button"
      tabIndex="-1"
      className="hidden bn_thread-comment__options__icon bn_thread-comment__options__like"
    >&nbsp;</a>
    <a
      className="bn_thread-comment__options__icon bn_thread-comment__options__comment"
      role="button"
      tabIndex="-1"
      onClick={commentClicked}
    >&nbsp;</a>
  </VisiblityByAccess>
);

MainTopicOptions.propTypes = propTypes;
MainTopicOptions.defaultProps = defaultProps;

export default MainTopicOptions;
