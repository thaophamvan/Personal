import React from 'react';
import PropTypes from 'prop-types';

import ToolTip from '../Tooltip';
import HideDevice from '../HideDevice';

const propTypes = {
  enableMarkAsRead: PropTypes.bool,
  markAsReadClicked: PropTypes.func,
};

const defaultProps = {
  enableMarkAsRead: false,
  markAsReadClicked: () => { },
};

class MarkAsReadButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToolTip: false,
    };
    this.toogleToolTip = this.toogleToolTip.bind(this);
    this.hideToolTip = this.hideToolTip.bind(this);
  }
  toogleToolTip() {
    const { enableMarkAsRead } = this.props;
    if (enableMarkAsRead) {
      const { showToolTip } = this.state;
      this.setState({
        showToolTip: !showToolTip,
      });
    }
  }
  hideToolTip() {
    this.setState({
      showToolTip: false,
    });
  }

  render() {
    const { enableMarkAsRead, markAsReadClicked } = this.props;
    const markAsReadState = enableMarkAsRead ? '' : 'no-access';
    const { showToolTip } = this.state;
    return (
      <a
        className={`bn_topbar__setting bn_topbar__setting__filter-asread ${markAsReadState}`}
        data-tip="Markera som läst"
        onClick={() => { this.hideToolTip(); markAsReadClicked(); }}
        onMouseEnter={this.toogleToolTip}
        onMouseLeave={this.toogleToolTip}
        role="button"
        tabIndex="-1"
      >
        <HideDevice>
          <ToolTip showToolTip={showToolTip} text="Markera som läst" />
        </HideDevice>
        <span className="material-icons">done_all</span>
      </a>

    );
  }
}

MarkAsReadButton.propTypes = propTypes;
MarkAsReadButton.defaultProps = defaultProps;

export default MarkAsReadButton;
