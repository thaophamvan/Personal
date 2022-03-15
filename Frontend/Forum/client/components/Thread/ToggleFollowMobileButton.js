import React from 'react';
import PropTypes from 'prop-types';

import { IfComponent } from '../share';

const propTypes = {
  onFollow: PropTypes.func,
  onUnFollow: PropTypes.func,
  isFollowEnable: PropTypes.bool,
  hasAccess: PropTypes.bool,
};

const defaultProps = {
  onFollow: () => {},
  onUnFollow: () => {},
  isFollowEnable: false,
  hasAccess: false,
};

class ToggleFollowMobileButton extends React.Component {
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
    const { onFollow, onUnFollow, hasAccess } = this.props;
    const buttonStyle = 'bn_button__follow bn_box__icon material-icons';
    const computedStyle = hasAccess ? buttonStyle : `${buttonStyle} no-access`;
    return (
      <IfComponent
        condition={isFollowEnable}
        whenTrue={(
          <a
            className={computedStyle}
            onClick={() => { this.toggleFollow(); onFollow(); }}
            role="button"
            tabIndex="-1"
          >star_border</a>
        )}
        whenFalse={(
          <a
            className={computedStyle}
            onClick={() => { this.toggleFollow(); onUnFollow(); }}
            role="button"
            tabIndex="-1"
          >grade</a>
        )}
      />
    );
  }
}

ToggleFollowMobileButton.propTypes = propTypes;
ToggleFollowMobileButton.defaultProps = defaultProps;

export default ToggleFollowMobileButton;
