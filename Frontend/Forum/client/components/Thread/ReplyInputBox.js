import React from 'react';
import PropTypes from 'prop-types';
import {
  VisiblityByAccess,
  ContentEditable,
  UploadButton,
  Validator,
} from '../share';

const propTypes = {
  sendReplyClick: PropTypes.func,
  replyNo: PropTypes.number,
  hasAccess: PropTypes.bool,
};

const defaultProps = {
  sendReplyClick: () => { },
  replyNo: -1,
  hasAccess: false,
};

class ReplyInputBox extends React.Component {
  constructor(props) {
    super(props);
    this.setupState = this.setupState.bind(this);
    this.handleSendReplyClick = this.handleSendReplyClick.bind(this);
    this.updateBody = this.updateBody.bind(this);
    this.clearTextSelection = this.clearTextSelection.bind(this);
    this.validate = this.validate.bind(this);
    this.setupState();
  }

  setupState() {
    this.state = {
      isBodyValid: true,
    };
    this.body = '';
  }

  handleSendReplyClick(event) {
    if (this.validate()) {
      const { sendReplyClick, replyNo } = this.props;
      // server validate auto remove div tag
      const newMessage = this.body.replace(/<div>/gi, '<p>').replace(/<\/div>/gi, '</p>');
      sendReplyClick(newMessage, replyNo);
      this.body = '';

      // fix close keyboard, restore placeholder
      document.getElementById(`txtContentEditable_${replyNo}`).focus();
      setTimeout(() => {
        document.activeElement.blur();
        this.clearTextSelection();
      }, 100);
    }
  }

  updateBody(body) {
    this.body = body;
  }

  clearTextSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) { // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) { // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (this.document.selection) { // IE?
      this.document.selection.empty();
    }
  }

  validate() {
    const isBodyValid = this.body.replace(/<\/?[^>]+(>|$)/g, '').trim() !== '';
    this.setState({
      isBodyValid,
    });
    return isBodyValid;
  }

  render() {
    const { hasAccess, replyNo } = this.props;
    const { isBodyValid } = this.state;
    const editorId = `txtContentEditable_${replyNo}`;
    return (
      <VisiblityByAccess
        hasAccess={hasAccess}
        className="bn_thread__reply-comment__input-box bn_display-flex"
      >
        <div className="bn_thread__reply-comment__textbox bn_display-flex">
          <div className="bn_thread__reply-comment__textbox-wrapper bn_display-flex">
            <ContentEditable
              className="bn_thread__reply-comment__textbox-input"
              id={editorId}
              placeholder="Skriv ett svar..."
              html={this.body}
              onChange={this.updateBody}
            />
            <UploadButton
              onUploaded={this.updateBody}
              editorId={editorId}
              labelClassName="bn_thread__reply-comment__upload-link material-icons"
              buttonClassName="bn_thread__reply-comment__upload-button"
              id={`txtUploadImage_${replyNo}`}
            />
          </div>
          <Validator isValid={isBodyValid} />
        </div>
        <button
          className="bn_thread__reply-comment__send-button"
          onClick={this.handleSendReplyClick}
        >
          Svara
        </button>
      </VisiblityByAccess>
    );
  }
}

ReplyInputBox.propTypes = propTypes;
ReplyInputBox.defaultProps = defaultProps;

export default ReplyInputBox;
