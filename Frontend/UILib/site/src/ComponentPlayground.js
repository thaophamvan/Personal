import React from 'react';
import PropTypes from 'prop-types';

import ComponentDemo from '../src/ComponentDemo';

import Switch from '../../lib/components/switch/switch';
import TextField from '../../lib/components/textField/textField';

const typeValidotors = {
  bool: () => true,
  string: () => true,
  number: val => /^-?\d+$/g.test(val || ''),
};

const typeConverters = {
  bool: val => val,
  string: val => val.toString(),
  number: val => parseInt(val, 10),
};

function getType(proptypeFunc) {
  for (const key in PropTypes) { // eslint-disable-line no-restricted-syntax
    if (PropTypes[key].isRequired === proptypeFunc) {
      return { isRequired: true, type: key };
    }
    if (PropTypes[key] === proptypeFunc) {
      return { type: key, isRequired: false };
    }
  }
  return { type: '' };
}

function getUnControlledPlaygroundProps(elements, controlledPropsOverride) {
  const { defaultProps, propTypes, props } = elements.reduce((acc, element) => ({
    defaultProps: { ...acc.defaultProps, ...element.type.defaultProps },
    propTypes: { ...acc.propTypes, ...element.type.propTypes },
    props: { ...acc.props, ...element.props },
  }), { defaultProps: {}, propTypes: {}, props: {} });

  return Object.entries(props)
    .reduce((acc, [prop, value]) => {
      const { type } = getType(propTypes[prop]);

      // we don't use those in playground
      const isFunc = ['func', 'element', 'node', 'oneOf'].indexOf(type) >= 0;

      // controllerdProp - property that is set from outside
      const isControlledProp = defaultProps[prop] !== value &&
        controlledPropsOverride.indexOf(prop) < 0;

      if (isFunc || isControlledProp) {
        return acc;
      }

      // that is basic internal format, we keep types because
      // we paractically can do nothing with <PropTypes> they're not extendable
      acc[prop] = { type, value, error: '' };
      return acc;
    }, {});
}

function getComponentPropsFrom(componentProps, playgroundProps) {
  // we want to override own componentProps  only by
  // valid value (e.g correct type, etc) from palygroundProps
  return Object.entries(playgroundProps)
    .reduce((acc, [prop, { type, value }]) => {
      const checkValid = typeValidotors[type];
      acc[prop] = checkValid(value) ?
        value : componentProps[prop];
      return acc;
    }, {});
}

export default class ComponentPlayground extends React.PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    excludedProps: PropTypes.arrayOf(PropTypes.string),
    controlledPropsOverride: PropTypes.arrayOf(PropTypes.string),
    nestedComponents: PropTypes.arrayOf(PropTypes.any),
  }

  static defaultProps = {
    excludedProps: [],
    controlledPropsOverride: [],
    nestedComponents: [],
  }

  constructor(props) {
    super(props);
    const { children, nestedComponents, controlledPropsOverride } = props;

    // All props that are set from outside
    // we skip and let outside environment control them
    //
    // If you need to set <required> property from outside
    // but still want to use this property in playground
    // you should declare this property in <controlledPropsOverride>

    // Hackish way to disable prop types warnings for a while...
    const savedConsoleError = console.error;
    console.error = () => {};
    const elements = [children, ...nestedComponents.map(c => React.createElement(c))];
    console.error = savedConsoleError;

    const playgroundProps =
      getUnControlledPlaygroundProps(elements, controlledPropsOverride);
    this.state = { playgroundProps };
  }

  getOnChange = (prop, type) => {
    const convert = typeConverters[type];
    const checkValid = typeValidotors[type];

    return (value) => {
      this.applyProp(prop, checkValid(value) ?
        { value: convert(value), error: '' } :
        { value, error: 'Invalid value type' });
    };
  }

  getSwitchOnChange = prop =>
    () => this.applyProp(prop, { value: !this.state.playgroundProps[prop].value })

  getSettings() {
    const { excludedProps } = this.props;
    const { playgroundProps } = this.state;

    return Object.entries(playgroundProps)
      .map(([prop, { type, value, error }]) => {
        if (excludedProps.indexOf(prop) >= 0) {
          return null;
        }

        if (type === 'bool') {
          return (
            <div className="component-playground__switch-field" key={prop}>
              <Switch
                label={prop}
                value={value}
                onChange={this.getSwitchOnChange(prop)}
              />
            </div>
          );
        }

        if (type === 'string') {
          return (
            <TextField
              key={prop}
              label={prop}
              value={value}
              multiLine
              errorText={error}
              onChange={this.getOnChange(prop, type)}
            />
          );
        }

        if (type === 'number') {
          return (
            <TextField
              key={prop}
              label={`${prop} (number)`}
              value={value}
              errorText={error}
              onChange={this.getOnChange(prop, type)}
            />
          );
        }

        return null;
      });
  }

  applyProp(prop, diff) {
    const { playgroundProps } = this.state;

    this.setState({
      playgroundProps: {
        ...playgroundProps,
        [prop]: { ...playgroundProps[prop], ...diff },
      },
    });
  }

  render() {
    const { playgroundProps } = this.state;
    const { children: { type: Component, props } } = this.props;

    const componentProps = getComponentPropsFrom(props, playgroundProps);

    return (
      <div className="component-playground">

        <div className="component-playground__demo">
          <ComponentDemo>
            <Component {...props} {...componentProps} />
          </ComponentDemo>
        </div>

        <div className="component-playground__settings">
          { this.getSettings() }
        </div>

      </div>
    );
  }
}
