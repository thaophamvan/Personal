import React from 'react';
import PropTypes from 'prop-types';

import { EditorDialog, TextEditor, Dialog, Validator, UploadImages } from '../share';
import { isNotEmptyHtml } from '../../utilities';

const propTypes = {
  isVisible: PropTypes.bool,
  cancelClicked: PropTypes.func,
  sendClicked: PropTypes.func,
  onCloseClicked: PropTypes.func,
  Thread: PropTypes.shape({
    Body: PropTypes.string,
  }),
};

const defaultProps = {
  isVisible: false,
  cancelClicked: () => {},
  sendClicked: () => {},
  onCloseClicked: () => {},
  Thread: {},
};

class EditThreadDialog extends React.Component {
  constructor(props) {
    super(props);

    this.textChanged = this.textChanged.bind(this);
    this.subjectChanged = this.subjectChanged.bind(this);
    this.validate = this.validate.bind(this);
    this.setupState(props);
  }
  componentWillReceiveProps(nextProps) {
    this.setupState(nextProps);
  }
  setupState(props) {
    const { Thread } = props;
    const { Body, Subject } = Thread;
    const isSubjectValid = true;
    const isBodyValid = true;
    this.Body = Body;
    this.state = {
      Subject,
      isSubjectValid,
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
    const { Subject } = this.state;
    const { Body } = this;
    const isSubjectValid = Subject.trim() !== '';
    const isBodyValid = isNotEmptyHtml(Body);
    this.setState({
      isSubjectValid,
      isBodyValid,
    });
    return isSubjectValid && isBodyValid;
  }
  render() {
    const { isVisible, cancelClicked, sendClicked, onCloseClicked, Thread } = this.props;
    const { Subject, isSubjectValid, isBodyValid } = this.state;
    const title = 'Redigera tråden';
    if (isVisible) {
      return (
        <Dialog
          title={title}
          isVisible={isVisible}
          onCloseClicked={onCloseClicked}
        >
          <EditorDialog
            title={`${title} - ${Thread.Subject}`}
            cancelClicked={cancelClicked}
            sendClicked={() => { if (this.validate()) { sendClicked(Subject, this.Body, Thread.ThreadId); } }}
            isVisible={isVisible}
          >
            <input
              type="text"
              className="bn_editor-comment__subject"
              value={Subject}
              placeholder="Rubrik på inlägget"
              onChange={this.subjectChanged}
            />
            <Validator isValid={isSubjectValid} />
            <TextEditor
              content={this.Body}
              onChange={this.textChanged}
              id="edit-thread-editor"
            />
            <UploadImages onUploaded={this.textChanged} editorId="edit-thread-editor" />
            <Validator isValid={isBodyValid} />
          </EditorDialog>
        </Dialog>
      );
    }

    return null;
  }
}

EditThreadDialog.propTypes = propTypes;
EditThreadDialog.defaultProps = defaultProps;

export default EditThreadDialog;
