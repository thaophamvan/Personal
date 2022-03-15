import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash/core';

import DropDownOptions from './DropDownOptions';
import './style.scss';

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.string,
    isSeparator: PropTypes.bool,
  })),
  selectedValue: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

const defaultProps = {
  items: [],
  selectedValue: '',
  className: '',
  onChange: () => {},
};

class DropDown extends React.Component {
  constructor(props) {
    super(props);
    const { selectedValue, items } = props;

    this.setupState = this.setupState.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.selectionChanged = this.selectionChanged.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.setupState(selectedValue, items);
  }
  componentWillReceiveProps(nextProps) {
    const { selectedValue, items } = nextProps;
    this.setupState(selectedValue, items);
  }
  onBlur(event) {
    const currentTarget = event.currentTarget;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({
          showOption: false,
        });
      }
    }, 0);
  }
  setupState(selectedValue, items) {
    const showOption = false;
    let computedSelectedValue = selectedValue;
    if (!computedSelectedValue && items && items.length) {
      computedSelectedValue = items[0].value;
    }
    const selectedItem = find(items, { value: computedSelectedValue });
    this.state = {
      selectedValue: computedSelectedValue,
      showOption,
      selectedItem,
    };
  }
  toggleDropDown() {
    const { showOption } = this.state;
    this.setState({
      showOption: !showOption,
    });
  }
  selectionChanged(selection) {
    const { onChange } = this.props;
    onChange(selection);
    this.setState({
      selectedValue: selection.value,
      selectedItem: selection,
    });
  }
  render() {
    const { selectedItem, showOption } = this.state;
    const { items, className } = this.props;
    const selectedText = selectedItem ? selectedItem.text : '';
    return (
      <div
        className={`bn_topbar-filter__list ui-corner-all ui-state-default ${className}`}
        onClick={this.toggleDropDown}
        onBlur={this.onBlur}
        role="button"
        tabIndex="-1"
      >
        <span className="ui-selectmenu-status">{selectedText}</span>
        <DropDownOptions items={items} onSelect={this.selectionChanged} isVisible={showOption} />
      </div>
    );
  }
}

DropDown.propTypes = propTypes;
DropDown.defaultProps = defaultProps;

export default DropDown;
