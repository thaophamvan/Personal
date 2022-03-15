import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const List = props => {
  const { autoSize, padding, centered, direction } = props;

  const block = 'klara-ui-list';
  const classes = classNames(block, {
    [`${block}__auto-size`]: autoSize,
    [`${block}__padding-${padding}`]: padding,
    [`${block}__centered`]: centered,
    [`${block}__${direction}`]: direction,
  });

  return (
    <ul className={classes}>
      {React.Children.map(props.children, child => <li>{child}</li>)}
    </ul>
  );
};

List.propTypes = {
  autoSize: PropTypes.bool,
  padding: PropTypes.string,
  centered: PropTypes.bool,
  direction: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.any),
};

List.defaultProps = {
  autoSize: false,
  padding: 'medium',
  centered: false,
  direction: 'center-center',
  children: null,
};

List.propDescriptions = {
  autoSize: 'true to make list items stretch evenly',
  padding: 'small, medium or large',
  direction: 'right, down, left, up or center-center',
  children: 'HTML-element or <Component />',
};

export default List;
