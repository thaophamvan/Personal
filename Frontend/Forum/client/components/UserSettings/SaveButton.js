import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  onClick: PropTypes.func,
};

const defaultProps = {
  onClick: () => { },
};

const SaveButton = ({ onClick }) => (
  <div className="bn_text-right">
    <input onClick={onClick} type="button" className="bn_user-settings__button" value="Spara inställningar" />
  </div>
);

SaveButton.propTypes = propTypes;
SaveButton.defaultProps = defaultProps;

export default SaveButton;
