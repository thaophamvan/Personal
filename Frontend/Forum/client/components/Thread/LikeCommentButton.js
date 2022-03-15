import React from 'react';

const propTypes = {
};

const defaultProps = {
};

const LikeCommentButton = () => (
  <div className="postInfo bn_button__like bn_topbar-share--icon bn_thread-comment--like hidden">
    Like
  </div>
);

LikeCommentButton.propTypes = propTypes;
LikeCommentButton.defaultProps = defaultProps;

export default LikeCommentButton;
