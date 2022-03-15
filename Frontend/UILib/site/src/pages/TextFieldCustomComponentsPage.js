import React from 'react';
import PropsTypes from 'prop-types';

import { Row, Column } from '../Layout';

import ComponentPlayground from '../ComponentPlayground';

import Badge from '../../../lib/components/badge/badge';
import TextField from '../../../lib/components/textField/textField';

class CustomEditField extends React.Component {
  static propTypes = {
    tags: PropsTypes.arrayOf(PropsTypes.string).isRequired,
    value: PropsTypes.string,
    disabled: PropsTypes.bool,
    className: PropsTypes.string,
    onAdd: PropsTypes.func,
    onRemove: PropsTypes.func,
    onChange: PropsTypes.func,
  }

  static defaultProps = {
    value: '',
    disabled: false,
    className: '',
    onAdd: () => {},
    onRemove: () => {},
    onChange: () => {},
  }

  onChange = (event) => {
    this.props.onChange(event.target.value);
  }

  onKeyDown = (event) => {
    const {
      value, tags, onAdd, onRemove,
    } = this.props;

    if (event.which === 13 && value.length) {
      onAdd(value);
    }

    if (event.which === 8 && tags.length && !value.length) {
      onRemove(tags[tags.length - 1]);
    }
  }

  onClick = tag => () => {
    const { disabled, onRemove } = this.props;
    if (disabled) {
      return;
    }
    onRemove(tag);
  }

  // should prevent focus of entire field
  onMouseDown = event => event.preventDefault()

  focus = () => {
    this.inputRef.focus();
  }

  fillRef = (ref) => {
    this.inputRef = ref;
  }

  render() {
    const {
      value,
      tags,
      className,
      onAdd, // just to keepout of attrs
      onRemove, // just to keepout of attrs
      onChange, // just to keepout of attrs
      ...attrs
    } = this.props;

    // I'll use already existing styles
    // for the sake of simplicity
    const inputStyle = {
      flex: '1 25%',
      minWidth: 0,
      margin: '2px 0',
      cursor: 'inherit',
    };

    const rootStyle = {
      lineHeight: 1,
      display: 'flex',
      flexFlow: 'row wrap',
      alignContent: 'flex-start',
    };

    const badgeStyle = { margin: '2px 3px 2px 0' };
    /* eslint-disable react/no-array-index-key */

    return (
      <div style={rootStyle}>

        { tags.map((tag, i) => (
          <div
            key={`badge-${i}`}
            style={badgeStyle}
            onMouseDown={this.onMouseDown}
          >
            <Badge
              icon="remove"
              rightAlignedIcon
              onIconClick={this.onClick(tag)}
            >
              {tag}
            </Badge>
          </div>
        )) }

        <input
          type="text"
          {...attrs}
          ref={this.fillRef}
          value={value}
          style={inputStyle}
          className={className}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
      </div>
    );
  }
}

/* eslint-disable react/no-multi-comp */
export default class TextFields extends React.Component {
  constructor() {
    super();
    this.state = {
      customComponentFieldValue: {
        tags: [
          'Kalifornien',
          'Förvaltningsdomstolen',
          'Gävleborg',
          'Västmanland',
        ],
        inputValue: '',
      },
    };
  }

  onAdd = (value) => {
    alert(`Adding ${value}`); // eslint-disable-line
  }

  onRemove = (value) => {
    alert(`Adding ${value}`); // eslint-disable-line
  }

  onInputChange = (value) => {
    this.setState({ value });
  }

  getHandlers = field => ({
    value: this.state[field].inputValue,
    onChange: val => this.setState((state) => {
      const prevFieldState = state[field];
      return { [field]: { ...prevFieldState, inputValue: val } };
    }),
    staticLabel: Boolean(this.state[field].tags.length),
  })

  getCustomFieldHandlers = field => ({
    tags: this.state[field].tags,
    onAdd: (tag) => {
      this.setState((state) => {
        const prevFieldState = state[field];
        const nextTags = [...prevFieldState.tags, tag];
        return { [field]: { ...prevFieldState, tags: nextTags, inputValue: '' } };
      });
    },
    onRemove: (tag) => {
      this.setState((state) => {
        const prevFieldState = state[field];
        const nextTags = prevFieldState.tags.filter(n => n !== tag);
        return { [field]: { ...prevFieldState, tags: nextTags } };
      });
    },
  })

  render() {
    return (
      <div>
        <h1>Text Field. Custom Component</h1>

        <p> Example and some specs on how to use custom input component with TextField.</p>
        <p>To supply a custom component to TextField, use the render prop <em>renderInput</em></p>

        <p>
          The render prop will be called with one argument <em>inputProps</em>
          which includes the following properties:
        </p>

        <code className="block">
          value -- proxied from <em>TextField</em><br />
          placeholder -- string <br />
          disabled -- bool <br />
          className -- string <em>(.text-field__control)</em> + your <em>className</em> <br />
          maxLength -- number (-1 or any positive integer proxied from <em>TextField</em> <br />
          onBlur() -- will call corresponding <em>TextField</em> callback <br />
          onFocus() -- will call corresponding <em>TextField</em> callback <br />
          onChange() -- will call corresponding <em>TextField</em> callback <br />
          ref() -- register a ref to the component
        </code>

        <h3>NB! MaxLength feature</h3>
        <p>Max length hard limit is implemented using native browser capabilities
          for <em>input</em> and <em>textarea</em> tags.
        </p>

        <p>In case if <em>maxLength</em> and <em>shouldClipAtMaxLength</em> properties are set custom
          component will have to implement clipping at max length logic itself
        </p>

        <h2>Examples</h2>

        <Row>
          <Column>
            <ComponentPlayground
              excludedProps={['className']}
              controlledPropsOverride={['label', 'maxLength', 'helperText']}
            >
              <TextField
                label="Field with custom component"
                maxLength={15}
                helperText="Emulating inner autosuggest"
                {...this.getHandlers('customComponentFieldValue')}
                renderInput={inputProps =>
                  (<CustomEditField
                    {...this.getCustomFieldHandlers('customComponentFieldValue')}
                    {...inputProps}
                  />)
                }
              />
            </ComponentPlayground>
          </Column>
        </Row>

      </div>
    );
  }
}
