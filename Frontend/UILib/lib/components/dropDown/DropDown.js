import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { KEY_DOWN, KEY_UP, KEY_ENTER, KEY_ESCAPE, KEY_SPACE } from './../../utils/keyConstants';
import Icon from './../icon/icon';
import DropDownOption from './DropDownOption';

const block = 'drop-down';

// Todo: React.PureComponent?
class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      highlightedValue: null,
    };
  }

  setIsOpen(isOpen) {
    const stateUpdate = { isOpen };
    if (!isOpen) {
      stateUpdate.highlightedValue = null;
    }
    this.setState(stateUpdate);
  }

  toggleIsOpen = () => {
    this.setIsOpen(!this.state.isOpen);
  }

  handleBlur = () => {
    this.setIsOpen(false);
  }

  handleMouseEnterOption = (value) => {
    this.setState({ highlightedValue: value });
  }

  handleMouseLeaveOption = () => {
    this.setState({ highlightedValue: null });
  }

  handleKeyDown = (event) => {
    const { onChange, options } = this.props;
    const { isOpen, highlightedValue } = this.state;
    const isNavigatingUp = KEY_UP === event.keyCode;
    const isNavigatingDown = KEY_DOWN === event.keyCode;
    const isOpeningOptions = !isOpen && (KEY_SPACE === event.keyCode || isNavigatingUp || isNavigatingDown);
    const isClosingOptions = KEY_ESCAPE === event.keyCode;
    const isChangingValue = isOpen && [KEY_ENTER, KEY_SPACE].includes(event.keyCode);

    if (isChangingValue) {
      event.preventDefault();
      onChange(highlightedValue);
      this.setIsOpen(false);
    }
    if (isNavigatingUp || isNavigatingDown) {
      event.preventDefault();
      const currentIndex = options.findIndex(option => option.value === highlightedValue);
      if (currentIndex === -1) {
        const newValue = options[isNavigatingUp ? options.length - 1 : 0].value;
        this.setState({ highlightedValue: newValue });
      } else {
        const requestedIndex = (currentIndex === -1 ? 0 : currentIndex) + (isNavigatingUp ? -1 : 1);
        const constrainedIndex = ((requestedIndex % options.length) + options.length) % options.length;
        const newValue = options[constrainedIndex].value;
        this.setState({ highlightedValue: newValue });
      }
    }
    if (isOpeningOptions) {
      event.preventDefault();
      this.setIsOpen(true);
    }
    if (isClosingOptions) {
      event.preventDefault();
      this.setIsOpen(false);
    }
  }

  resolveLabel() {
    const { selectedValue, placeholder, options } = this.props;

    if (selectedValue === undefined || selectedValue === null) {
      return placeholder;
    }

    const option = options
      .find(({ value }) => value === selectedValue);

    if (option && option.label) {
      return option.label;
    }

    return '';
  }

  render() {
    const {
      className,
      onChange,
      options,
      selectedValue,
      showOptionsAbove,
    } = this.props;

    const {
      isOpen,
      highlightedValue,
    } = this.state;

    const dropDownClasses = classNames(block, className, {
      [`${block}--open`]: isOpen,
      [`${block}--show-options-above`]: showOptionsAbove,
    });

    const optionsComponent = isOpen && (
      <ul className={`${block}__options`} onMouseLeave={this.handleMouseLeaveOption}>
        { options.map(option => (
          <DropDownOption
            key={option.value}
            value={option.value}
            label={option.label}
            isSelected={selectedValue === option.value}
            isHighlighted={highlightedValue === option.value}
            onSelect={onChange}
            onMouseEnter={this.handleMouseEnterOption}
            onMouseLeave={this.handleMouseLeaveOption}
          />
        ))
        }
      </ul>);

    return (
      <div
        className={dropDownClasses}
        onClick={this.toggleIsOpen}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleBlur}
        tabIndex={0}
      >
        <div className={`${block}__wrapper`}>
          <span className={`${block}__label`}>
            { this.resolveLabel() }
          </span>
          <Icon small shape="chevron_down" size={15} className={`${block}__arrow`} />
          { optionsComponent }
        </div>
      </div>
    );
  }
}

DropDown.defaultProps = {
  className: '',
  onChange: () => {
  },
  options: [],
  placeholder: '',
  selectedValue: null,
  showOptionsAbove: false,
};

DropDown.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.number, PropTypes.bool, PropTypes.string,
    ]),
  })),
  placeholder: PropTypes.string,
  selectedValue: PropTypes.oneOfType([
    PropTypes.number, PropTypes.bool, PropTypes.string,
  ]),
  showOptionsAbove: PropTypes.bool,
};

DropDown.propDescriptions = {
  options: 'An array of options. Option fields: label, value',
  showOptionsAbove: 'Position the list of options above the dropdown itself',
};

export default DropDown;
