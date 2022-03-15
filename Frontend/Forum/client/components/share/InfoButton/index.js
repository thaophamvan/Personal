import React, { PropTypes } from 'react';

import ToolTip from '../Tooltip';
import HideDevice from '../HideDevice';

const propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {
  className: '',
  title: '',
  onClick: () => { },
};

class InfoButton extends React.Component {
  constructor(props) {
    super(props);
    const showToolTip = false;
    this.state = {
      showToolTip,
    };
    this.toogleToolTip = this.toogleToolTip.bind(this);
  }
  toogleToolTip() {
    const { showToolTip } = this.state;
    this.setState({
      showToolTip: !showToolTip,
    });
  }
  render() {
    const { className, title, onClick } = this.props;
    const { showToolTip } = this.state;
    return (
      <a
        role="button"
        tabIndex="-1"
        onClick={onClick}
        data-tip={title}
        className={`bn_button__infor ${className}`}
        onMouseEnter={this.toogleToolTip}
        onMouseLeave={this.toogleToolTip}
      >
        <HideDevice>
          <ToolTip showToolTip={showToolTip} text={title} />
        </HideDevice>
        <span className="bn_button__infor-label">i</span>
      </a>
    );
  }
}

InfoButton.propTypes = propTypes;
InfoButton.defaultProps = defaultProps;

export default InfoButton;
