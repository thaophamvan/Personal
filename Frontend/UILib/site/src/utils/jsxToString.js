import React from 'react';

// const JSX_REGEXP = /"<.+>"/g;

const isDefaultProp = (defaultProps, key, value) => {
  if (!defaultProps) return false;
  return defaultProps[key] === value;
};

/*
function stringifyObject(object, opts) {
  if (Array.isArray(object)) {
    return object.map((item) => stringifyObject(item));
  } else if (object && typeof object === 'object') {
    return Object.keys(object).reduce((result, key) => {
      const value = object[key];
      if (React.isValidElement(value)) {
        return Object.assign({ [key]: jsxToString(value, opts) }, result); // eslint-disable-line no-use-before-define
      } else if (Array.isArray(value)) {
        return Object.assign({ [key]: value.map((item) => stringifyObject(item, opts)) }, result);
      } else if (typeof value === 'object') {
        return Object.assign({ [key]: stringifyObject(value, opts) }, result);
      } else if (typeof value === 'function') {
        if (!opts.useFunctionCode) {
          return Object.assign({ [key]: '' }, result);
        }
        const functionName = opts.functionNameOnly ? value.name.toString() : value.toString();
        return Object.assign({ [key]: functionName }, result);
      }
      return result;
    }, {});
  }
  return object;
}
*/

function serializeItem(item, options, delimit = true) {
  if (typeof item === 'string') {
    return delimit ? `"${item}"` : item;
  } else if (typeof item === 'number' || typeof item === 'boolean') {
    return `${item}`;
  } else if (Array.isArray(item)) {
    const indentation = new Array(options.spacing + 1).join(' ');
    const delimiter = delimit ? ', ' : `\n${indentation}`;
    const items = item.map(i => serializeItem(i, options)).join(delimiter);
    return delimit ? `[${items}]` : `${items}`;
  } else if (React.isValidElement(item)) {
    return jsxToString(item, options); // eslint-disable-line no-use-before-define
  } else if (typeof item === 'object') {
    return JSON.stringify(item, null, 2);
    // const stringified = JSON.stringify(stringifyObject(item, options));
    // return stringified.replace(JSX_REGEXP, (match) => match.slice(1, match.length - 1));
  } else if (typeof item === 'function') {
    if (!options.useFunctionCode) return '() => {}';
    return options.functionNameOnly ? item.name.toString() : item.toString();
  }
  return item;
}

function jsxToString(component, options) {
  const baseOpts = {
    displayName: component.type.displayName || component.type.name || component.type,
    ignoreProps: [],
    keyValueOverride: {},
    spacing: 0,
    detectFunctions: false,
  };

  const opts = { ...baseOpts, ...options };

  const componentData = {
    name: opts.displayName,
  };

  delete opts.displayName;

  if (component.props) {
    componentData.props = Object
      .keys(component.props)
      .filter(key => (
        key !== 'children' &&
        !isDefaultProp(component.type.defaultProps, key, component.props[key]) &&
        opts.ignoreProps.indexOf(key) === -1
      ))
      .map((key) => {
        let value;

        if (typeof opts.keyValueOverride[key] === 'function') {
          value = opts.keyValueOverride[key](component.props[key]);
        } else if (opts.keyValueOverride[key]) {
          value = opts.keyValueOverride[key];
        } else {
          value = serializeItem(component.props[key], { ...opts, key });
        }

        if (typeof value !== 'string' || value[0] !== '"') {
          value = `{${value}}`;
        }
        if (component.props[key] === true) {
          return key;
        }
        return `${key}=${value}`;
      })
      .join(' ');

    if (component.key && opts.ignoreProps.indexOf('key') === -1) {
      componentData.props += `key='${component.key}'`;
    }

    if (componentData.props.length > 0) {
      componentData.props = ` ${componentData.props}`;
    }
  }

  if (component.props.children) {
    opts.spacing += 2;
    const indentation = new Array(opts.spacing + 1).join(' ');
    if (Array.isArray(component.props.children)) {
      componentData.children = component.props.children
        .reduce((a, b) => a.concat(b), []) // handle Array of Arrays
        .filter(child => child)
        .map(child => serializeItem(child, opts, false))
        .join(`\n${indentation}`);
    } else {
      componentData.children =
        serializeItem(component.props.children, opts, false);
    }
    return `<${componentData.name}${componentData.props}>\n` +
      `${indentation}${componentData.children}\n` +
      `${indentation.slice(0, -2)}</${componentData.name}>`;
  }
  return `<${componentData.name}${componentData.props} />`;
}

export default jsxToString;
