import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const ToolTip = (props) => {
  const { children, direction, zIndex } = props;
  const className = 'klara-ui-tooltip';

  const classes = classnames(className, `${className}__${direction}`);

  return (
    <div className={classes} style={{ zIndex }}>
      <div className="klara-ui-tooltip__inner">
        <div className="klara-ui-tooltip__text">{ children }</div>
      </div>
    </div>
  );
};

ToolTip.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.string,
  zIndex: PropTypes.number,
};

ToolTip.defaultProps = {
  direction: 'left',
  zIndex: 999,
};

ToolTip.propDescriptions = {
  children: 'Text as output for the tooltip',
  direction: 'Up, right, down or left; from where would you like the tooltip to render',
  zIndex: 'If the implementation requires a higher/lower zIndex',
};

export default ToolTip;
