import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MainTopicHeader from './MainTopicHeader';
import MainTopicBody from './MainTopicBody';
import MainTopicFooter from './MainTopicFooter';

import { computeEditPermissionForThread } from '../../utilities';

const propTypes = {
  className: PropTypes.string,
  editPermission: PropTypes.bool,
  reportPermission: PropTypes.bool,
  commentPermission: PropTypes.bool,
  editClicked: PropTypes.func,
  reportClicked: PropTypes.func,
  commentClicked: PropTypes.func,
  mainTopic: PropTypes.shape({}),
  hasAccess: PropTypes.bool,
  onFollow: PropTypes.func,
  onUnFollow: PropTypes.func,
  isMarked: PropTypes.bool,
  toggleShowUnreadComments: PropTypes.func,
  commentOptions: PropTypes.shape({}),
};

const defaultProps = {
  className: '',
  editPermission: false,
  reportPermission: false,
  commentPermission: false,
  editClicked: () => { },
  reportClicked: () => { },
  commentClicked: () => { },
  mainTopic: {},
  hasAccess: false,
  onFollow: () => { },
  onUnFollow: () => { },
  isMarked: false,
  toggleShowUnreadComments: () => { },
  commentOptions: {},
};

const MainTopic = ({ className, editPermission, reportPermission, commentPermission,
  onFollow, onUnFollow, editClicked, reportClicked, commentClicked, mainTopic,
  hasAccess, isMarked, toggleShowUnreadComments, commentOptions }) => {
  const { Thread, FirstMessageId } = mainTopic;
  return (
    <div id={`comment-${FirstMessageId}`} className={`bn_thread-wrapper ${className}`}>
      <MainTopicHeader
        editClicked={editClicked}
        editPermission={editPermission}
        reportPermission={reportPermission}
        reportClicked={() => reportClicked(mainTopic.FirstMessageId)}
        commentPermission={commentPermission}
        commentClicked={commentClicked}
        UserAlias={Thread.UserAlias}
        CreateDate={Thread.CreateDate}
        MessageCount={Thread.MessageCount}
        UserId={Thread.UserId}
        UserFavor={Thread.UserFavor}
        hasAccess={hasAccess}
        onFollow={onFollow}
        onUnFollow={onUnFollow}
        isFollowEnable={!isMarked}
      />
      <MainTopicBody
        Subject={Thread.Subject}
        Body={Thread.Body}
      />
      <MainTopicFooter
        editClicked={editClicked}
        editPermission={editPermission}
        reportPermission={reportPermission}
        reportClicked={() => reportClicked(mainTopic.FirstMessageId)}
        commentPermission={commentPermission}
        commentClicked={commentClicked}
        hasAccess={hasAccess}
        toggleShowUnreadComments={toggleShowUnreadComments}
        commentOptions={commentOptions}
      />
    </div>
  );
};

MainTopic.propTypes = propTypes;
MainTopic.defaultProps = defaultProps;

const mapStateToProps = state => ({
  mainTopic: state.mainTopic,
  isMarked: state.mainTopic.IsMarked,
  editPermission: computeEditPermissionForThread(state.app.credentials, state.mainTopic.Thread),
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MainTopic);
