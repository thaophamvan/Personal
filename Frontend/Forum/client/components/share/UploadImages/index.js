import React from 'react';
import PropTypes from 'prop-types';

import UploadButton from '../UploadButton';

import './uploadimages.scss';

const propTypes = {
  onUploaded: PropTypes.func,
  editorId: PropTypes.string,
};

const defaultProps = {
  onUploaded: () => { },
  editorId: '',
};

class UploadImages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadMessage: 'Infoga bild, max 800x600, 512k',
    };
    this.onChangeStatus = this.onChangeStatus.bind(this);
  }
  onChangeStatus(message) {
    this.state = {
      uploadMessage: message,
    };
  }
  render() {
    const { uploadMessage } = this.state;
    const { onUploaded, editorId } = this.props;
    return (
      <div className="bn_editor-comment__upload">
        <UploadButton
          onUploaded={onUploaded}
          editorId={editorId}
          labelClassName="bn_editor-comment__upload-link"
          buttonClassName="bn_editor-comment__upload-button"
          onChangeStatus={this.onChangeStatus}
        />
        <span className="bn_editor-comment__upload-status"> - {uploadMessage}</span>
      </div>
    );
  }
}

UploadImages.propTypes = propTypes;
UploadImages.defaultProps = defaultProps;

export default UploadImages;
