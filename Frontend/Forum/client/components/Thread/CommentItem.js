import React from 'react';
import PropTypes from 'prop-types';
import scrollTo from 'scroll-to';
import isMobile from 'ismobilejs';

import CommentItemBody from './CommentItemBody';
import LikeCommentButton from './LikeCommentButton';
import { userInArray, getScrollPosition, getScrollY } from '../../utilities';
import { IfComponent } from '../share';
import ReplyComment from './ReplyComment';
import CommentItemOptions from './CommentItemOptions';
import ToggleReplyComment from './ToggleReplyComment';

const propTypes = {
  MessageId: PropTypes.number,
  UserAlias: PropTypes.string,
  UserId: PropTypes.number,
  UserFavor: PropTypes.bool,
  Body: PropTypes.string,
  DeletionStatus: PropTypes.number,
  CreateDate: PropTypes.string,
  Subject: PropTypes.string,
  Number: PropTypes.number,
  hasAccess: PropTypes.bool,
  editPermission: PropTypes.bool,
  reportPermission: PropTypes.bool,
  toggleIgnoredPermission: PropTypes.bool,
  deletePermission: PropTypes.bool,
  editClicked: PropTypes.func,
  reportClicked: PropTypes.func,
  deleteClicked: PropTypes.func,
  ignoredUsers: PropTypes.arrayOf(PropTypes.shape({})),
  thread: PropTypes.shape({}),
  subComments: PropTypes.arrayOf(PropTypes.shape({})),
  sendCommentClicked: PropTypes.func,
};

const defaultProps = {
  MessageId: 0,
  UserAlias: '',
  UserId: 0,
  UserFavor: false,
  Body: '',
  DeletionStatus: 0,
  CreateDate: '',
  Subject: '',
  Number: 0,
  hasAccess: false,
  editPermission: false,
  reportPermission: false,
  toggleIgnoredPermission: false,
  deletePermission: false,
  editClicked: () => { },
  reportClicked: () => { },
  deleteClicked: () => { },
  ignoredUsers: [],
  thread: {},
  subComments: [],
  sendCommentClicked: () => { },
};

class CommentItem extends React.Component {
  constructor(props) {
    super(props);

    this.onToggleIgnored = this.onToggleIgnored.bind(this);
    this.onExpandCollapse = this.onExpandCollapse.bind(this);
    this.onReplyCommentClick = this.onReplyCommentClick.bind(this);
    this.setupState(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setupState(nextProps);
  }

  setupState(props) {
    this.state = {
      ignoredMenuState: false,
      expandedState: props.subComments.length > 0,
    };
  }

  onToggleIgnored() {
    const { ignoredMenuState } = this.state;
    this.setState({
      ignoredMenuState: !ignoredMenuState,
    });
  }

  onExpandCollapse() {
    const { expandedState } = this.state;
    this.setState({
      expandedState: !expandedState,
    });
  }

  onReplyCommentClick() {
    const { MessageId } = this.props;
    this.setState({
      expandedState: true,
    }, () => {
      const isDesktop = !isMobile.phone && !isMobile.tablet;
      const scrollY = getScrollY();
      const editor = document.getElementById(`txtContentEditable_${MessageId}`);
      if (!isDesktop) {
        editor.focus();
      }
      setTimeout(() => {
        const editorPosition = getScrollPosition(editor);
        const hScreen = window.innerHeight || document.documentElement.clientHeight
          || document.body.clientHeight;
        if (isMobile.phone || isMobile.tablet || editorPosition > (scrollY + hScreen)) {
          const newPosition = (isMobile.phone || isMobile.tablet) ?
            editorPosition - 80 : (editorPosition + 100) - hScreen;
          scrollTo(0, newPosition, { duration: 200 });
        }
        if (isDesktop) {
          editor.focus();
        }
      }, 0);
    });
  }

  render() {
    const { ignoredMenuState, expandedState } = this.state;
    const { MessageId, UserAlias, Body, Number, DeletionStatus, CreateDate, hasAccess, editClicked,
      editPermission, deletePermission, reportPermission, toggleIgnoredPermission, reportClicked,
      deleteClicked, UserId, UserFavor, ignoredUsers, Subject, thread, subComments, sendCommentClicked,
    } = this.props;
    const ignoredUser = userInArray(ignoredUsers, UserId);

    return (
      <li id={`comment-${MessageId}`} className="cf bn_thread-comment__item commentUnread js-commentItem odd">
        <div className="commentWrapper bn_thread-comment__box">
          <div className="bn_thread-comment__main">
            <CommentItemBody
              hasAccess={hasAccess}
              MessageId={MessageId}
              UserId={UserId}
              UserFavor={UserFavor}
              UserAlias={UserAlias}
              Body={Body}
              CreateDate={CreateDate}
              Subject={Subject}
              DeletionStatus={DeletionStatus}
              ignoredUser={ignoredUser}
              thread={thread}
              ignoredMenuState={ignoredMenuState}
              deletePermission={deletePermission}
              reportPermission={reportPermission}
              toggleIgnoredPermission={toggleIgnoredPermission}
              editPermission={editPermission}
              reportClicked={reportClicked}
              deleteClicked={deleteClicked}
              editClicked={editClicked}
              toggleIgnored={this.onToggleIgnored}
              number={Number}
            />
            <LikeCommentButton />
          </div>
          <IfComponent
            condition={DeletionStatus === 0}
            whenTrue={
              <CommentItemOptions
                deletePermission={deletePermission}
                hasAccess={hasAccess}
                reportPermission={reportPermission}
                toggleIgnoredPermission={toggleIgnoredPermission}
                editPermission={editPermission}
                reportClicked={reportClicked}
                deleteClicked={deleteClicked}
                editClicked={editClicked}
                ignoredUser={ignoredUser}
                toggleIgnored={this.onToggleIgnored}
                ignoredMenuState={ignoredMenuState}
                onReplyCommentClick={this.onReplyCommentClick}
                hiddenRightMenu
              />
            }
            whenFalse={null}
          />
          <ToggleReplyComment
            hasAccess={hasAccess}
            subCommentCount={subComments.length}
            expandedState={expandedState}
            onExpandCollapse={this.onExpandCollapse}
          />
          <IfComponent
            condition={expandedState}
            whenTrue={
              <ReplyComment
                hasAccess={hasAccess}
                replyNo={MessageId}
                thread={thread}
                subComments={subComments}
                sendCommentClicked={sendCommentClicked}
                reportClicked={reportClicked}
                deleteClicked={deleteClicked}
                editClicked={editClicked}
              />
            }
            whenFalse={null}
          />
        </div>
      </li>
    );
  }
}


CommentItem.propTypes = propTypes;
CommentItem.defaultProps = defaultProps;

export default CommentItem;
