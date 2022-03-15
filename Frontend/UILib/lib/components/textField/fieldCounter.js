import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

const FieldCounter = (props) => {
  const { className, maxLength, value } = props;

  if (maxLength < 0) {
    return null;
  }

  const counterPos = maxLength - value.length;
  const rootClassName = classNames(className, 'field-counter', {
    'field-counter--maxed': counterPos < 0,
  });

  return (
    <div className={rootClassName}>
      { counterPos }
    </div>
  );
};

FieldCounter.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  maxLength: PropTypes.number,
  className: PropTypes.string,
};

FieldCounter.defaultProps = {
  value: '',
  className: '',
  maxLength: -1,
};

export default FieldCounter;
