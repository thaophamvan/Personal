import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import TopBar from './TopBar';
import { EditorDialog, UploadImages, Validator, TextEditor } from '../share';
import {
  validateAuthorization,
  isNotEmptyHtml,
  getForumLink,
} from '../../utilities';
import { saveNewThread } from '../../actions';

const propTypes = {
  hasAccess: PropTypes.bool,
  onSaveNewThread: PropTypes.func,
  isSaving: PropTypes.bool,
  forumId: PropTypes.string,
  forumLink: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

const defaultProps = {
  hasAccess: false,
  onSaveNewThread: () => { },
  isSaving: false,
  forumId: '',
  forumLink: '',
  history: {},
};

class NewThread extends React.Component {
  constructor(props) {
    super(props);

    this.onSaveClicked = this.onSaveClicked.bind(this);
    this.onCancelClicked = this.onCancelClicked.bind(this);
    this.setupState = this.setupState.bind(this);
    this.updateSubject = this.updateSubject.bind(this);
    this.updateBody = this.updateBody.bind(this);
    this.validate = this.validate.bind(this);
    this.setupState();
  }
  onSaveClicked(newData) {
    if (!this.props.isSaving && this.validate()) {
      const { forumId } = this.props;
      const { subject } = this.state;
      this.props.onSaveNewThread(forumId, -1, subject, this.body, -1);
    }
  }

  onCancelClicked() {
    const { forumLink, history } = this.props;
    history.push(forumLink);
  }
  setupState() {
    const isBodyValid = true;
    const isSubjectValid = true;
    const subject = '';
    const threadId = -1;
    const messageId = -1;
    this.state = {
      isBodyValid,
      isSubjectValid,
      subject,
      threadId,
      messageId,
    };
    this.body = '';
  }
  updateSubject(event) {
    const subject = event.target.value;
    this.setState({
      subject,
    });
  }
  updateBody(body) {
    this.body = body;
  }
  validate() {
    const { subject } = this.state;
    const body = this.body;
    const isSubjectValid = subject.trim() !== '';
    const isBodyValid = isNotEmptyHtml(body);
    this.setState({
      isSubjectValid,
      isBodyValid,
    });
    return isSubjectValid && isBodyValid;
  }
  render() {
    const { hasAccess } = this.props;
    if (!hasAccess) { return null; }

    const { subject, isSubjectValid, isBodyValid } = this.state;
    const body = this.body;
    return (
      <div className="bn_editor">
        <TopBar />
        <EditorDialog
          title="Skriv ny tråd"
          sendClicked={this.onSaveClicked}
          cancelClicked={this.onCancelClicked}
          isVisible
          isShowEditorWarning
        >
          <input
            type="text"
            value={subject}
            onChange={this.updateSubject}
            className="bn_editor-comment__subject"
            placeholder="Rubrik på inlägget"
          />
          <Validator isValid={isSubjectValid} />
          <TextEditor
            id="newThreadEditor"
            content={body}
            onChange={this.updateBody}
            autoFocus={false}
          />
          <UploadImages onUploaded={this.updateBody} editorId="newThreadEditor" />
          <Validator isValid={isBodyValid} />
        </EditorDialog>
      </div>
    );
  }
}

NewThread.propTypes = propTypes;
NewThread.defaultProps = defaultProps;

const mapStateToProps = state => ({
  hasAccess: validateAuthorization(state.app.credentials),
  isSaving: state.loading.isLoadingType2MainColumn,
  forumLink: getForumLink(state.app.selectedForum, state.app.menuItems, true),
  forumId: state.app.selectedForum,
});

const mapDispatchToProps = dispatch => ({
  onSaveNewThread: (forum, threadId, subject, body, messageId) => {
    console.log(body);
    dispatch(saveNewThread(forum, threadId, subject, body, messageId));
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewThread));
