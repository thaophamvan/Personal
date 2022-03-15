import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

const Logo = ({ children }) => (
  <section className="bn_header__middle">
    <Link to="/" className="bn_header-logo">
      Börssnack
    </Link>
    {(children)}
  </section>
);

Logo.propTypes = propTypes;
Logo.defaultProps = defaultProps;

export default Logo;
