import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { uploadImageRequest } from '../../../actions';

const propTypes = {
  onUploaded: PropTypes.func,
  uploadRequest: PropTypes.func,
};

const defaultProps = {
  onUploaded: (data) => { console.log(data); },
  uploadRequest: () => {},
};

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  handleFileUpload(e) {
    const file = e.target.files[0];
    const { onUploaded } = this.props;
    if (file) {
      this.props.uploadRequest({
        file,
        name: file.name,
        onUploaded,
      });
    }
  }

  render() {
    return (
      <div className="bn_editor-comment__upload">
        <label htmlFor="bn_imageupload" className="bn_editor-comment__upload-link">&nbsp;</label>
        <input
          id="bn_imageupload"
          type="file"
          className="hidden"
          onChange={this.handleFileUpload}
          accept="image/jpeg,image/gif,image/png"
        />
        <span className="bn_editor-comment__upload-status"> - Infoga bild, max 800x600, 512k</span>
      </div>
    );
  }
}


ImageUpload.propTypes = propTypes;
ImageUpload.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => ({

});
const mapDispatchToProp = dispatch => ({
  uploadRequest: req => dispatch(uploadImageRequest(req)),
});

export default connect(mapStateToProps, mapDispatchToProp)(ImageUpload);
