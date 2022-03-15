import React from 'react';
import PropTypes from 'prop-types';

import { TextEditor, EditorDialog, Dialog, Validator, UploadImages } from '../share';
import { isNotEmptyHtml } from '../../utilities';

const propTypes = {
  isVisible: PropTypes.bool,
  cancelClicked: PropTypes.func,
  sendClicked: PropTypes.func,
  onCloseClicked: PropTypes.func,
  Comment: PropTypes.shape({
    Body: PropTypes.string,
  }),
};

const defaultProps = {
  isVisible: false,
  cancelClicked: () => { },
  sendClicked: () => { },
  onCloseClicked: () => { },
  Comment: {},
};

class EditCommentDialog extends React.Component {
  constructor(props) {
    super(props);

    this.textChanged = this.textChanged.bind(this);
    this.setupState(props);
  }
  componentWillReceiveProps(nextProps) {
    this.setupState(nextProps);
  }
  setupState(props) {
    const { Comment } = props;
    const { Body } = Comment || {};
    const isBodyValid = true;
    this.Body = Body;
    this.state = {
      isBodyValid,
    };
  }
  subjectChanged(event) {
    this.setState({
      Subject: event.target.value,
    });
  }
  textChanged(Body) {
    this.Body = Body;
  }
  validate() {
    const { Body } = this;
    const isBodyValid = isNotEmptyHtml(Body);
    this.setState({
      isBodyValid,
    });
    return isBodyValid;
  }
  render() {
    const { isVisible, cancelClicked, sendClicked, onCloseClicked, Comment } = this.props;
    const { isBodyValid } = this.state;
    const title = 'Redigera kommentaren';
    if (isVisible) {
      return (
        <Dialog
          title={title}
          isVisible={isVisible}
          onCloseClicked={onCloseClicked}
        >
          <EditorDialog
            title={title}
            cancelClicked={cancelClicked}
            sendClicked={() => {
              if (this.validate()) {
                sendClicked(this.Body, Comment.MessageId, Comment.ReplyNo);
              }
            }}
            isVisible={isVisible}
          >
            <TextEditor
              content={this.Body}
              onChange={this.textChanged}
              id="edit-comment-editor"
              buttons={[]}
            />
            <UploadImages onUploaded={this.textChanged} editorId="edit-comment-editor" />
            <Validator isValid={isBodyValid} />
          </EditorDialog>
        </Dialog>
      );
    }

    return null;
  }
}

EditCommentDialog.propTypes = propTypes;
EditCommentDialog.defaultProps = defaultProps;

export default EditCommentDialog;
