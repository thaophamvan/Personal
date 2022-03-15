import React from 'react';
import PropTypes from 'prop-types';

import { DropDown } from '../share';

const propTypes = {
  forumOptions: PropTypes.arrayOf(PropTypes.shape({

  })),
  forumOptionChanged: PropTypes.func,
};

const defaultProps = {
  forumOptions: [],
  forumOptionChanged: () => {},
};

const AdminPanelMoveDropDown = ({ forumOptions, forumOptionChanged }) => (
  <DropDown
    items={forumOptions}
    className="bn_topbar-filter__list-sort"
    onChange={forumOptionChanged}
  />
);

AdminPanelMoveDropDown.propTypes = propTypes;
AdminPanelMoveDropDown.defaultProps = defaultProps;

export default AdminPanelMoveDropDown;
