import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip, HideDevice } from '../share';

const propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};

const defaultProps = {
  className: '',
  onClick: () => {},
  title: '',
};

class UnFollowButton extends React.Component {
  constructor(props) {
    super(props);
    this.toogleToolTip = this.toogleToolTip.bind(this);

    const showToolTip = false;
    this.state = {
      showToolTip,
    };
  }
  toogleToolTip(showToolTip) {
    this.setState({
      showToolTip,
    });
  }
  render() {
    const { className, onClick, title } = this.props;
    const { showToolTip } = this.state;
    return (
      <a
        onClick={onClick}
        className={`bn_thread-header__follow ${className}`}
        role="button"
        tabIndex="-1"
        onMouseEnter={() => { this.toogleToolTip(true); }}
        onMouseLeave={() => { this.toogleToolTip(false); }}
      >
        <HideDevice>
          <Tooltip className="tooltip--unfollow" showToolTip={showToolTip} text={title} />
        </HideDevice>
        <i className="bn_thread-header__star material-icons">grade</i>
      </a>
    );
  }
}

UnFollowButton.propTypes = propTypes;
UnFollowButton.defaultProps = defaultProps;

export default UnFollowButton;
