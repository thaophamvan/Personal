import React from 'react';
import PropTypes from 'prop-types';
import scrollTo from 'scroll-to';
import { IfComponent } from '../../share';
import { getScrollY } from '../../../utilities';

import './jumptotop.scss';

const propTypes = {
  commentCount: PropTypes.number,
};

const defaultProps = {
  commentCount: 0,
};


class JumpToTop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButton: false,
    };

    this.scrollDuration = 200;
    this.buttonJumpTopClick = ::this.buttonJumpTopClick;
    this.adjustButtonToToggle = ::this.adjustButtonToToggle;
  }


  componentDidMount() {
    this.adjustButtonToToggle(this.props.commentCount);
  }

  componentWillReceiveProps(nextProps) {
    this.adjustButtonToToggle(nextProps.commentCount);
  }

  buttonJumpTopClick(e) {
    scrollTo(0, 0, { duration: this.scrollDuration });
    e.preventDefault();
  }

  adjustButtonToToggle() {
    const hScreen = window.innerHeight
      || document.documentElement.clientHeight || document.body.clientHeight;
    const rect = this.btnContainer.getBoundingClientRect();
    this.setState({
      showButton: rect.top + getScrollY() > hScreen,
    });
  }

  render() {
    return (
      <div ref={(el) => { this.btnContainer = el; }}>
        <IfComponent
          condition={this.state.showButton}
          whenTrue={(
            <div className="bn_jump-to-top__container">
              <a
                className="bn_jump-to-top__button"
                role="button"
                tabIndex="-1"
                onClick={this.buttonJumpTopClick}
                data-position="top"
              >
                <i className="material-icons">arrow_upward</i>
                <span className="bn_jump-to-top__label">
                  Tillbaka till toppen
                </span>
              </a>
            </div>
          )}
          whenFalse={null}
        />
      </div>
    );
  }
}

JumpToTop.propTypes = propTypes;
JumpToTop.defaultProps = defaultProps;

export default JumpToTop;
