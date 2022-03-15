import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import jsxToString from './utils/jsxToString';

const ComponentDemo = ({ children, title, vertical }) => {
  const classes = classNames('component-demo', {
    'component-demo--vertical': vertical,
  });

  return (
    <div className={classes}>
      { title && <h2 className="component-demo__title">{ title }</h2> }
      <div className="component-demo__container">
        <div className="component-demo__sandbox">
          { children }
        </div>
        <div className="component-demo__code">
          <code className="block">
            { jsxToString(children, {
                ignoreProps: ['key'],
              }) }
          </code>
        </div>
      </div>
    </div>
  );
};

ComponentDemo.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  vertical: PropTypes.bool,
};

ComponentDemo.defaultProps = {
  vertical: false,
  title: '',
};

export default ComponentDemo;
