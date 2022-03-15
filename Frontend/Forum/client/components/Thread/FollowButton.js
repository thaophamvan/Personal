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

class FollowButton extends React.Component {
  constructor(props) {
    super(props);

    this.toogleToolTip = this.toogleToolTip.bind(this);
    this.setupState = this.setupState.bind(this);

    this.setupState();
  }
  componentWillReceiveProps() {
    this.setupState();
  }
  setupState() {
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
    const { className, title, onClick } = this.props;
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
          <Tooltip className="tooltip--follow" showToolTip={showToolTip} text={title} />
        </HideDevice>
        <i className="bn_thread-header__star material-icons">star_border</i>
      </a>
    );
  }
}

FollowButton.propTypes = propTypes;
FollowButton.defaultProps = defaultProps;

export default FollowButton;
