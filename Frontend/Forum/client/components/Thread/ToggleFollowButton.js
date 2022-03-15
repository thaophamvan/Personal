import React from 'react';
import PropTypes from 'prop-types';

import { IfComponent } from '../share';
import FollowButton from './FollowButton';
import UnFollowButton from './UnFollowButton';

const propTypes = {
  className: PropTypes.string,
  onFollow: PropTypes.func,
  onUnFollow: PropTypes.func,
  isFollowEnable: PropTypes.bool,
};

const defaultProps = {
  className: '',
  onFollow: () => {},
  onUnFollow: () => {},
  isFollowEnable: false,
};

class ToggleFollowButton extends React.Component {
  constructor(props) {
    super(props);
    const { isFollowEnable } = props;
    this.state = {
      isFollowEnable,
    };

    this.toggleFollow = this.toggleFollow.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { isFollowEnable } = nextProps;
    this.state = {
      isFollowEnable,
    };
  }
  toggleFollow() {
    const { isFollowEnable } = this.state;
    this.setState({
      isFollowEnable: !isFollowEnable,
    });
  }
  render() {
    const { isFollowEnable } = this.state;
    const { className, onFollow, onUnFollow } = this.props;
    return (
      <IfComponent
        condition={isFollowEnable}
        whenFalse={(
          <UnFollowButton
            className={className}
            title="Sluta följa denna tråd"
            onClick={() => { this.toggleFollow(); onUnFollow(); }}
          />
        )}
        whenTrue={(
          <FollowButton
            className={className}
            title="Följ denna tråd"
            onClick={() => { this.toggleFollow(); onFollow(); }}
          />
        )}
      />);
  }
}

ToggleFollowButton.propTypes = propTypes;
ToggleFollowButton.defaultProps = defaultProps;

export default ToggleFollowButton;
