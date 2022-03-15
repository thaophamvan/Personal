import React from 'react';
import PropTypes from 'prop-types';

function dataFromPropType(proptypeFunc) {
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

function dataFromComponent({
  propTypes,
  defaultProps,
  overridePropTypes = {},
  propDescriptions = {},
}) {
  return Object
    .keys(propTypes)
    .map(prop => ({
      name: prop,
      description: propDescriptions[prop],
      default: defaultProps[prop],
      ...(overridePropTypes[prop] || dataFromPropType(propTypes[prop])),
    }))
    .map(propData => ({
      ...propData,
      default: !propData.isRequired ? propData.default : '',
    }));
}

const PropsTable = ({ propsData, component }) => (
  <div className="props-table">
    <table className="style-guide__table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        { (propsData || dataFromComponent(component)).map(prop => (
          <tr key={prop.name}>
            <td><pre>{prop.name}</pre></td>
            <td>{prop.type}</td>
            <td>{prop.isRequired ? 'Yes' : 'No'}</td>
            <td>{String(prop.default)}</td>
            <td>{prop.description}</td>
          </tr>
        )) }
      </tbody>
    </table>
  </div>
);

PropsTable.propTypes = {
  propsData: PropTypes.shape(),
  component: PropTypes.func.isRequired,
};

PropsTable.defaultProps = {
  propsData: null,
};

export default PropsTable;
