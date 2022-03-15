import React from 'react';
import PropTypes from 'prop-types';
import VisibleWhen from '../VisibleWhen';
import IfComponent from '../IfComponent';
import SendButton from '../SendButton';
import CancelButton from '../CancelButton';

const propTypes = {
  isVisible: PropTypes.bool,
  isShowEditorWarning: PropTypes.bool,
  cancelClicked: PropTypes.func,
  sendClicked: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
};

const defaultProps = {
  isVisible: false,
  isShowEditorWarning: false,
  cancelClicked: () => {},
  sendClicked: () => {},
  title: '',
  Thread: {},
  children: null,
};

const EditDialog = ({ title, children, sendClicked, cancelClicked, isVisible, isShowEditorWarning }) => (
  <VisibleWhen className="bn_editor-comment" when={isVisible}>
    <div className="bn_editor-comment__wrapper">
      {(children)}
    </div>
    <div className="buttonWrapper bn_editor-comment__buttons-area bn_display-flex">
      <IfComponent
        condition={isShowEditorWarning}
        whenTrue={(
          <span className="bn_editor-comment__warning js_editor-comment__warning">
            Trådar/kommentarer kan endast redigeras inom 60 minuter.</span>
        )}
        whenFalse={null}
      />
      <SendButton onClick={sendClicked} />
      <CancelButton onClick={cancelClicked} />
    </div>
  </VisibleWhen>
);

EditDialog.propTypes = propTypes;
EditDialog.defaultProps = defaultProps;

export default EditDialog;
