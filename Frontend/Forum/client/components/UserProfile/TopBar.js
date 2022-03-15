import React from 'react';
import PropTypes from 'prop-types';

import { InfoButton, TopBar as SharedTopBar } from '../share';

const propTypes = {
  infoClicked: PropTypes.func,
};

const defaultProps = {
  infoClicked: () => { },
};

const TopBar = ({ infoClicked }) => (
  <div className="bn_topbar__wrapper">
    <SharedTopBar className="bn_topbar--blue">
      <span className="bn_topbar__label">Användarsida</span>
      <InfoButton title="Se vem denna användaren är" onClick={infoClicked} />
    </SharedTopBar>
  </div>
);

TopBar.propTypes = propTypes;
TopBar.defaultProps = defaultProps;

export default TopBar;
