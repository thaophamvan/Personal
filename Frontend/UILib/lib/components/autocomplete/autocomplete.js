import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import {
  KEY_DOWN,
  KEY_UP,
  KEY_ENTER,
  KEY_BACKSPACE,
} from './../../utils/keyConstants';

import TextField from '../textField/textField';
import Badge from '../badge/badge';

class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      inputFieldHasFocus: false,
    };
  }

  onKeyDown = e => {
    const { activeIndex } = this.state;
    const suggestions = this.getSuggestions();
    switch (e.keyCode) {
      case KEY_UP:
        e.preventDefault();
        this.onNavigateUp();
        break;
      case KEY_DOWN:
        e.preventDefault();
        this.onNavigateDown();
        break;
      case KEY_ENTER:
        e.preventDefault();
        this.onAddSuggestion(suggestions[activeIndex])();
        break;
      case this.props.handleBackspace && KEY_BACKSPACE:
        this.props.handleBackspace(e);
        break;
      case KEY_BACKSPACE:
        this.onRemoveByBackspace(e);
        break;
      default:
        break;
    }
  };

  onAddSuggestion = suggestion => () => {
    if (suggestion.id) {
      this.addSuggestionToItems(suggestion.id);
    } else {
      this.onCreate(suggestion.label);
    }
    this.textFieldRef.inputRef.focus();
  };

  onCreate = value => {
    this.props.onCreate(value);
  };

  onInputBlur = e => {
    if (e.relatedTarget !== this.componentRef) {
      this.setState({ activeIndex: 0, inputFieldHasFocus: false });
      this.props.onBlur(e);
    }
  };

  onInputChange = e => {
    if (!this.shouldAllowInput()) {
      return;
    }

    const { value } = e.target;
    this.setState({ activeIndex: 0 });
    this.props.onInputChange(value);
  };

  onInputFocus = e => {
    this.setState({ inputFieldHasFocus: true });
    this.props.onFocus(e);
  };

  onNavigateDown = () => {
    const { activeIndex } = this.state;
    const suggestions = this.getSuggestions();
    this.setState({
      activeIndex: Math.min(activeIndex + 1, suggestions.length - 1),
    });
  };

  onNavigateUp = () => {
    const { activeIndex } = this.state;
    this.setState({ activeIndex: Math.max(activeIndex - 1, 0) });
  };

  onRemoveByBackspace = e => {
    const { items, allowMultiple } = this.props;
    const inputValue = this.textFieldRef.inputRef.value;
    const canRemoveItem =
      (items.length && !allowMultiple) ||
      (items.length && this.shouldAllowInput() && !inputValue.length);
    if (canRemoveItem) {
      e.preventDefault();
      this.removeItem(items[items.length - 1].id);
    }
  };

  onRemoveItem = id => () => {
    this.removeItem(id);
  };

  getSuggestions() {
    const { suggestions, items, value: inputValue } = this.props;

    if (this.shouldRenderCreateOption(suggestions, items)) {
      return suggestions.concat([{ label: `${inputValue}` }]);
    }
    return suggestions;
  }

  setTextFieldRef = ref => {
    this.textFieldRef = ref;
  };

  focus = () => {
    this.textFieldRef.focus();
  };

  addSuggestionToItems(id) {
    const { allowMultiple, items } = this.props;
    if (!(!allowMultiple && items.length)) {
      this.setState({ activeIndex: 0 });
      this.props.onAdd(id);
    }
  }

  removeItem(id) {
    this.textFieldRef.inputRef.focus();
    this.props.onRemove(id);
  }

  shouldRenderCreateOption(suggestions, items) {
    if (!this.props.onCreate) {
      return false;
    }
    const { value: inputValue } = this.props;
    const inputValueIsEmpty = !inputValue.length;
    const inputValueIsInSuggestions = suggestions.find(
      s => s.label.toLowerCase() === inputValue.toLowerCase()
    );
    const inputValueIsInItems = items.find(
      i => i.label.toLowerCase() === inputValue.toLowerCase()
    );

    return (
      !inputValueIsEmpty && !inputValueIsInSuggestions && !inputValueIsInItems
    );
  }

  shouldShowSuggestions() {
    const { allowMultiple, items } = this.props;
    const suggestions = this.getSuggestions();
    return (
      this.state.inputFieldHasFocus &&
      suggestions.length &&
      !(!allowMultiple && items.length)
    );
  }

  shouldAllowInput() {
    const { items, allowMultiple } = this.props;
    return !(items.length && !allowMultiple);
  }

  renderPills() {
    const { items, allowMultiple } = this.props;
    return items.map(item => (
      <Badge
        className={classnames('badge--inline', {
          'badge--outline': !allowMultiple && this.state.inputFieldHasFocus,
        })}
        key={item.id}
        icon="remove"
        onIconClick={this.onRemoveItem(item.id)}
        rightAlignedIcon
      >
        {item.label}
      </Badge>
    ));
  }

  render() {
    const {
      className,
      items,
      value,
      renderSuggestion,
      renderCreateSuggestion,
      ...otherProps
    } = this.props;

    const { activeIndex } = this.state;

    const suggestions = this.getSuggestions();
    const Suggestion = ({ item, onClick, index }) => {
      const isActive = index === activeIndex;
      return (
        <li
          className={classnames('autocomplete__suggestion', {
            'autocomplete__suggestion--active': isActive,
          })}
          onClick={onClick}
          onMouseEnter={() => this.setState({ activeIndex: index })}
        >
          {item.id
            ? renderSuggestion(item.id, item.label)
            : renderCreateSuggestion(item.id, item.label)}
        </li>
      );
    };

    const suggestionItems = suggestions.map((suggestion, index) => (
      <Suggestion
        key={suggestion.id || 'unknown-id'}
        onClick={this.onAddSuggestion(suggestion)}
        item={suggestion}
        index={index}
      />
    ));

    return (
      <div
        className={classnames('autocomplete', className)}
        onKeyDown={this.onKeyDown}
        tabIndex="0"
        ref={r => {
          this.componentRef = r;
        }}
      >
        <TextField
          {...otherProps}
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
          onChange={this.onInputChange}
          value={value}
          ref={this.setTextFieldRef}
          staticLabel={Boolean(
            items.length > 0 || this.shouldShowSuggestions()
          )}
          renderInput={inputProps => (
            <div className="autocomplete__pill-wrapper">
              {items.length ? this.renderPills() : ''}
              <input type="text" {...inputProps} />
            </div>
          )}
          className={classnames('autocomplete__input', {
            'autocomplete__input--hidden': !this.shouldAllowInput(),
            'text-field--has-no-border': !this.shouldAllowInput(),
          })}
        />
        {this.shouldShowSuggestions() ? (
          <ul className="autocomplete__suggestions"> {suggestionItems} </ul>
        ) : (
          ''
        )}
      </div>
    );
  }
}

Autocomplete.propTypes = {
  allowMultiple: PropTypes.bool,
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onCreate: PropTypes.func,
  onInputChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  renderSuggestion: PropTypes.func,
  handleBackspace: PropTypes.func,
  renderCreateSuggestion: PropTypes.func,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
};

Autocomplete.defaultProps = {
  allowMultiple: true,
  className: '',
  onCreate: null,
  handleBackspace: null,
  onFocus: () => {},
  onBlur: () => {},
  renderSuggestion: (id, label) => label,
  renderCreateSuggestion: (id, label) => `${label} (skapa ny)`,
};

Autocomplete.propDescriptions = {
  allowMultiple:
    'Whether to allow addition of multiple pills (items) or not. If false, the input field will not be shown after adding a pill, but will appear again if it is deleted.',
  className:
    'Add additional class names. The component will always have the "autocomplete" class.',
  items:
    'An array representing the items. Each item in the array needs to have at least an "id" and a "label" property.',
  onAdd:
    'Callback that is fired when user adds something from the suggestions list.',
  onCreate:
    'Callback that is fired when user creates a new pill given the current input value. If left out, creation is not allowed.',
  onInputChange:
    'Callback that is fired when the input value changes. Expected to be used to trigger fetching of suggestions.',
  onRemove: 'Callback that is fired when a pill is removed.',
  renderSuggestion:
    'A function that is used to render a suggestion. If not specified, a standard rendering and styling will be given.',
  renderCreateSuggestion:
    'A function that is used to render a suggestion that will be created. If not specified, a standard rendering and styling will be given.',
  suggestions:
    'An array representing the suggestions. Each item in the array needs to have at least an "id" and a "label" property.',
};

Autocomplete.overridePropTypes = {
  items: { type: 'array', isRequired: 'Yes' },
  suggestions: { type: 'array', isRequired: 'Yes' },
};

export default Autocomplete;
