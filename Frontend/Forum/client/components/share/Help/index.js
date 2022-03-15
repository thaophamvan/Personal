import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '../Dialog';

const propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  onCloseClicked: PropTypes.func,
  showHelp: PropTypes.bool,
};

const defaultProps = {
  className: '',
  title: '',
  children: '',
  onCloseClicked: () => {},
  showHelp: false,
};

const Help = ({ className, title, children, onCloseClicked, showHelp }) => (
  <Dialog
    title={title}
    className={className}
    onCloseClicked={onCloseClicked}
    isVisible={showHelp}
  >
    {(children)}
  </Dialog>
);


Help.propTypes = propTypes;
Help.defaultProps = defaultProps;

export default Help;
