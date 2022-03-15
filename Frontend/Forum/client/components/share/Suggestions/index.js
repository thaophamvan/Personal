import React from 'react';
import PropTypes from 'prop-types';

import IfComponent from '../IfComponent';
import Item from './Item';
import './style.scss';

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.string,
  })),
  onItemClick: PropTypes.func,
  isVisible: PropTypes.bool,
  clickOutSide: PropTypes.func,
  className: PropTypes.string,
};

const defaultProps = {
  items: [],
  onItemClick: () => {},
  isVisible: true,
  clickOutSide: () => {},
  className: '',
};

class Suggestions extends React.Component {
  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }
  componentWillUnMount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }
  handleClick = (e) => {
    if (this.node && !this.node.contains(e.target)) {
      this.handleClickOutSide();
    }
  }
  handleClickOutSide = () => {
    this.props.clickOutSide();
  }
  render() {
    const { items, onItemClick, isVisible, className } = this.props;
    const computedStyle = `suggestions ui-autocomplete ui-menu ui-widget ui-widget-content ${className}`;
    return (
      <IfComponent
        condition={isVisible}
        whenTrue={(
          <ul
            ref={(node) => { this.node = node; }}
            className={computedStyle}
          >
            <li className="autocomplete-header">Gå direkt till användarsida:</li>
            {items.map(item => (
              <Item onClick={onItemClick} text={item.text} link={item.value} key={item.value} />
            ))}
          </ul>
        )}
        whenFalse={null}
      />
    );
  }
}

Suggestions.propTypes = propTypes;
Suggestions.defaultProps = defaultProps;

export default Suggestions;
