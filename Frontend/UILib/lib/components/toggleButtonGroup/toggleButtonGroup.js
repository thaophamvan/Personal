import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';

const ToggleButtonGroup = ({ children, activeIndex, onActiveIndexChange }) => (
  <div className="toggle-button-group"> {
    React.Children.map(children, (child, index) => {
      const buttonProps = {
        ...child.props,
        active: index === activeIndex,
        compact: true,
        onClick: (evt) => {
          onActiveIndexChange(index);
          if (child.props.onClick) {
            child.props.onClick(evt);
          }
        },
        roundLeft: index === 0,
        roundRight: index === children.length - 1,
      };
      return cloneElement(child, buttonProps);
    })
  }
  </div>
);

ToggleButtonGroup.defaultProps = {
  onActiveIndexChange: () => { },
};

ToggleButtonGroup.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  onActiveIndexChange: PropTypes.func,
};

export default ToggleButtonGroup;
