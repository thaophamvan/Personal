import React from 'react';
import PropTypes from 'prop-types';

import { Help } from '../share';

const propTypes = {
  isVisible: PropTypes.bool,
  onCloseClicked: PropTypes.func,
  onReportClicked: PropTypes.func,
  messageId: PropTypes.number,
};

const defaultProps = {
  isVisible: false,
  onCloseClicked: () => {},
  onReportClicked: () => {},
  messageId: 0,
};

class ReportModal extends React.Component {
  constructor(props) {
    super(props);
    const motivation = '';
    this.state = {
      motivation,
    };

    this.reportTextChanged = this.reportTextChanged.bind(this);
  }
  reportTextChanged(event) {
    const motivation = event.target.value;
    this.setState({
      motivation,
    });
  }
  render() {
    const { isVisible, onCloseClicked, onReportClicked, messageId } = this.props;
    const { motivation } = this.state;
    if (isVisible) {
      return (
        <Help onCloseClicked={onCloseClicked} showHelp={isVisible} title="Anmäl inlägget">
          <h2>Anmäl inlägg</h2>
          <div>
            <textarea
              placeholder="Motivering (max 100 tecken)"
              className="bn_thread__report__textarea"
              cols="45"
              rows="5"
              onChange={this.reportTextChanged}
              ref={(el) => { if (el) { el.focus(); } }}
            />
            <br />
            <input
              onClick={() => onReportClicked(messageId, motivation)}
              className="bn_thread__report__button commentsReportSubmit"
              type="submit"
              value="Skicka"
            />
          </div>
        </Help>
      );
    }
    return null;
  }
}

ReportModal.propTypes = propTypes;
ReportModal.defaultProps = defaultProps;

export default ReportModal;
