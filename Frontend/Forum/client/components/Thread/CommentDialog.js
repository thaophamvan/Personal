import React from 'react';
import PropTypes from 'prop-types';

import { TextEditor, EditorDialog, Validator, UploadImages } from '../share';
import { isNotEmptyHtml } from '../../utilities';

const propTypes = {
  isVisible: PropTypes.bool,
  cancelClicked: PropTypes.func,
  sendClicked: PropTypes.func,
  textEditorId: PropTypes.string.isRequired,
};

const defaultProps = {
  isVisible: false,
  cancelClicked: () => { },
  sendClicked: () => { },
  textEditorId: '',
};

class CommentDialog extends React.Component {
  constructor(props) {
    super(props);
    this.commentTextChanged = this.commentTextChanged.bind(this);
    this.setupState = this.setupState.bind(this);
    this.validate = this.validate.bind(this);
    this.setupState();
  }
  componentWillReceiveProps(props) {
    this.setupState();
  }
  setupState() {
    this.commentText = '';
    const isBodyValid = true;
    this.state = {
      isBodyValid,
    };
  }
  commentTextChanged(commentText) {
    this.commentText = commentText;
  }
  validate() {
    const isBodyValid = isNotEmptyHtml(this.commentText);
    this.setState({
      isBodyValid,
    });
    return isBodyValid;
  }
  render() {
    const { isVisible, cancelClicked, sendClicked, textEditorId } = this.props;
    const { isBodyValid } = this.state;
    return (
      <EditorDialog
        title="Ny kommentar"
        isVisible={isVisible}
        cancelClicked={() => { cancelClicked(); }}
        sendClicked={() => { if (this.validate()) { sendClicked(this.commentText, 0); } }}
        isShowEditorWarning
      >
        <TextEditor
          content={this.commentText}
          onChange={this.commentTextChanged}
          id={textEditorId}
        />
        <UploadImages onUploaded={this.commentTextChanged} editorId={textEditorId} />
        <Validator isValid={isBodyValid} />
      </EditorDialog>
    );
  }
}

CommentDialog.propTypes = propTypes;
CommentDialog.defaultProps = defaultProps;

export default CommentDialog;
