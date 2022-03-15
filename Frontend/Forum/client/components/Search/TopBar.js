import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  searchText: PropTypes.string,
};

const defaultProps = {
  searchText: '',
};

const TopBar = ({ searchText }) => (
  <div className="bn_topbar bn_topbar--blue bn_search__bar">
    <span className="bn_topbar__label">Sökresultat för &quot;{searchText}&quot;</span>
  </div>
);

TopBar.propTypes = propTypes;
TopBar.defaultProps = defaultProps;

export default TopBar;
