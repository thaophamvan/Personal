import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import CommentItemOptions from '../CommentItemOptions';
import { IfComponent } from '../../share';
import {
  dateToString,
  userInArray,
  isAdminRole,
  validateAuthorization,
  computeEditPermissionForComment,
} from '../../../utilities';
import CommentItemBodyContent from '../CommentItemBodyContent';

const propTypes = {
  comment: PropTypes.shape({}),
  ignoredUsers: PropTypes.arrayOf(PropTypes.shape({})),
  thread: PropTypes.shape({}),
  credentials: PropTypes.shape({}),
  reportPermission: PropTypes.bool,
  editClicked: PropTypes.func,
  reportClicked: PropTypes.func,
  deleteClicked: PropTypes.func,
};

const defaultProps = {
  comment: [],
  ignoredUsers: [],
  thread: {},
  credentials: {},
  reportPermission: false,
  editClicked: () => { },
  reportClicked: () => { },
  deleteClicked: () => { },
};

class SubCommentItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ignoredMenuState: false,
    };
    this.onToggleIgnored = this.onToggleIgnored.bind(this);
  }

  onToggleIgnored() {
    const { ignoredMenuState } = this.state;
    this.setState({
      ignoredMenuState: !ignoredMenuState,
    });
  }

  render() {
    const { comment, ignoredUsers, thread, credentials, reportPermission,
      editClicked, reportClicked, deleteClicked,
    } = this.props;
    const { ignoredMenuState } = this.state;
    const ignoredUser = userInArray(ignoredUsers, comment.UserId);
    const userLinkClass = `user bn_thread-comment__user ${comment.UserFavor ? 'bn_thread-comment__user--favor' : ''}`;
    return (
      <div className="bn_thread__reply-comment__item">
        <div className="bn_thread__reply-comment__wrapper">
          <div className="bn_thread__reply-comment__infor">
            <Link className={userLinkClass} to={`/user/${comment.UserId}`} >
              {comment.UserAlias}
            </Link> <span className="bn_thread__reply-comment__date">
              ({dateToString(comment.CreateDate)})
            </span>
          </div>
          <CommentItemBodyContent
            Body={comment.Body}
            DeletionStatus={comment.DeletionStatus}
            Subject={comment.Subject}
            ignoredUser={ignoredUser}
            thread={thread}
            ignoredMenuState={ignoredMenuState}
          />
        </div>
        <IfComponent
          condition={comment.DeletionStatus === 0}
          whenTrue={
            <CommentItemOptions
              deletePermission={isAdminRole(credentials)}
              hasAccess={validateAuthorization(credentials)}
              reportPermission={reportPermission}
              toggleIgnoredPermission={validateAuthorization(credentials)}
              editPermission={computeEditPermissionForComment(credentials, comment)}
              reportClicked={() => { reportClicked(comment.MessageId); }}
              deleteClicked={() => { deleteClicked(thread.ThreadId, comment.MessageId); }}
              editClicked={() => { editClicked(comment); }}
              ignoredUser={ignoredUser}
              toggleIgnored={this.onToggleIgnored}
              ignoredMenuState={ignoredMenuState}
              hiddenReplyButton
            />
          }
          whenFalse={null}
        />
      </div>
    );
  }
}


SubCommentItem.propTypes = propTypes;
SubCommentItem.defaultProps = defaultProps;

export default SubCommentItem;
