import React from 'react';
import PropTypes from 'prop-types';

import VisibleWhen from '../VisibleWhen';

const propTypes = {
  isMobile: PropTypes.bool,
};

const defaultProps = {
  isMobile: false,
};

const EmptyThread = ({ isMobile }) => (
  <VisibleWhen
    className="bn_thread__no-result"
    when={isMobile}
  >
    Inga trådar matchar det valda filtret
  </VisibleWhen>
);

EmptyThread.propTypes = propTypes;
EmptyThread.defaultProps = defaultProps;

export default EmptyThread;

