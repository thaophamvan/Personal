import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { uploadImageRequest } from '../../../actions';

const propTypes = {
  onUploaded: PropTypes.func,
  editorId: PropTypes.string,
  onUploadImageRequest: PropTypes.func,
  labelClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  onChangeStatus: PropTypes.func,
  id: PropTypes.string,
};

const defaultProps = {
  onUploaded: () => { },
  editorId: '',
  onUploadImageRequest: () => { },
  labelClassName: '',
  buttonClassName: '',
  onChangeStatus: () => { },
  id: 'txtUploadImage',
};

class UploadButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleInsertImage = this.handleInsertImage.bind(this);
    this.handleUploadFile = this.handleUploadFile.bind(this);
  }
  handleInsertImage(result) {
    let uploadMessage;
    const { onUploaded, editorId, onChangeStatus } = this.props;
    const imageLink = document.createElement('a');
    imageLink.setAttribute('href', result.FileUrl);
    imageLink.setAttribute('class', 'userImage');
    imageLink.setAttribute('target', '_blank');
    imageLink.innerHTML = 'Bild';

    if (editorId !== '') {
      const editor = document.getElementById(editorId);
      if (result.Succeded) {
        try {
          editor.focus();
          let range;
          if (document.selection) {
            range = document.selection.createRange();
            range.pasteHTML(imageLink);
          } else {
            range = document.getSelection().getRangeAt(0);
            range.insertNode(imageLink);
          }
          uploadMessage = 'Ok';
        } catch (ex) {
          editor.innerHTML += `<p>${imageLink.toString()}</p>`;
          uploadMessage = `Uppladdningen misslyckades: ${ex.toString()}`;
        }
      } else {
        uploadMessage = `Uppladdningen misslyckades: ${result.Message}`;
      }
      onChangeStatus(uploadMessage);
      onUploaded(editor.innerHTML);
    }
  }
  handleUploadFile(e) {
    const { onUploadImageRequest } = this.props;
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const name = file.name;
      const onUploaded = this.handleInsertImage;
      onUploadImageRequest({ file, name, onUploaded });
    }
  }
  render() {
    const { labelClassName, buttonClassName, id } = this.props;
    return (
      <label className={labelClassName} htmlFor={id}>
        &nbsp;
        <input
          id={id}
          type="file"
          className={buttonClassName}
          onChange={this.handleUploadFile}
          accept="image/jpeg,image/gif,image/png"
        />
      </label>
    );
  }
}

UploadButton.propTypes = propTypes;
UploadButton.defaultProps = defaultProps;

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  onUploadImageRequest: ({ file, name, onUploaded }) => {
    dispatch(uploadImageRequest({ file, name, onUploaded }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadButton);
