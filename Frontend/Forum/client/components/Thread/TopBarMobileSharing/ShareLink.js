import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { shareAction } from '../../../actions';

const propTypes = {
  shareLink: PropTypes.string,
  provider: PropTypes.string,
  target: PropTypes.string,
  text: PropTypes.string,
  onShareAction: PropTypes.func,
};

const defaultProps = {
  shareLink: '',
  provider: '',
  target: '_self',
  text: '',
  onShareAction: () => { },
};

const ShareLink = ({ shareLink, provider, target, text, onShareAction }) => (
  <li>
    <a href={shareLink} target={target} onClick={() => { onShareAction(provider); }}>
      <i className={`bn_button__share-icon bn_button__share--${provider}`} />
      <span className="bn_button__share-text">{text}</span>
    </a>
  </li>
);

ShareLink.propTypes = propTypes;
ShareLink.defaultProps = defaultProps;

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  onShareAction: (provider) => {
    dispatch(shareAction(provider));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShareLink);
