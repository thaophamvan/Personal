import React from 'react';
import PropTypes from 'prop-types';

import VisibileWhen from '../VisibleWhen';

const propTypes = {
  hasAccess: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};

const defaultProps = {
  hasAccess: false,
  children: null,
  className: '',
};

const VisibilityByAccess = ({ className, hasAccess, children }) => (
  <VisibileWhen when={hasAccess} className={className} >
    {(children)}
  </VisibileWhen>
);
VisibilityByAccess.propTypes = propTypes;
VisibilityByAccess.defaultProps = defaultProps;

export default VisibilityByAccess;
