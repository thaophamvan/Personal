import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { shareAction } from '../../../actions';

const propTypes = {
  shareLink: PropTypes.string,
  provider: PropTypes.string,
  target: PropTypes.string,
  onShareAction: PropTypes.func,
};

const defaultProps = {
  shareLink: '',
  provider: '',
  target: '_self',
  onShareAction: () => { },
};

const ShareLink = ({ shareLink, provider, target, onShareAction }) => (
  <a
    className="bn_topbar-share__link"
    href={shareLink}
    onClick={() => { onShareAction(provider); }}
    target={target}
  >
    <i className={`bn_topbar-share__${provider} bn_topbar-share--icon`} />
  </a>
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
