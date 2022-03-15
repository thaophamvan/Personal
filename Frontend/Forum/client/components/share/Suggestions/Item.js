import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

const propTypes = {
  text: PropTypes.string,
  link: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {
  text: '',
  link: '',
  onClick: () => {},
};

const Item = ({ text, link, onClick }) => (
  <li className="ui-menu-item">
    <Link onClick={onClick} to={link} className="ui-corner-all">{text}</Link>
  </li>
);

Item.propTypes = propTypes;
Item.defaultProps = defaultProps;

export default Item;
