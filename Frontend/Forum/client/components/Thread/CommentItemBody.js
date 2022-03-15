import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import CommentItemBodyContent from './CommentItemBodyContent';
import { dateToString } from '../../utilities';
import { IfComponent } from '../share';
import CommentItemRightMenu from './CommentItemRightMenu';

const propTypes = {
  hasAccess: PropTypes.bool,
  MessageId: PropTypes.number,
  UserAlias: PropTypes.string,
  CreateDate: PropTypes.string,
  Body: PropTypes.string,
  UserId: PropTypes.number,
  UserFavor: PropTypes.bool,
  DeletionStatus: PropTypes.number,
  Subject: PropTypes.string,
  ignoredUser: PropTypes.bool,
  thread: PropTypes.shape({}),
  ignoredMenuState: PropTypes.bool,
  deletePermission: PropTypes.bool,
  reportPermission: PropTypes.bool,
  toggleIgnoredPermission: PropTypes.bool,
  editPermission: PropTypes.bool,
  reportClicked: PropTypes.func,
  deleteClicked: PropTypes.func,
  editClicked: PropTypes.func,
  toggleIgnored: PropTypes.func,
  number: PropTypes.number,
};

const defaultProps = {
  hasAccess: false,
  MessageId: 0,
  UserAlias: '',
  CreateDate: '',
  Body: '',
  UserId: 0,
  UserFavor: false,
  DeletionStatus: 0,
  Subject: '',
  ignoredUser: false,
  thread: {},
  ignoredMenuState: false,
  deletePermission: false,
  reportPermission: false,
  toggleIgnoredPermission: false,
  editPermission: false,
  reportClicked: () => { },
  deleteClicked: () => { },
  editClicked: () => { },
  toggleIgnored: () => { },
  number: 0,
};


const CommentItemBody = ({
  hasAccess,
  MessageId,
  UserAlias,
  CreateDate,
  Body,
  UserId,
  UserFavor,
  DeletionStatus,
  Subject,
  ignoredUser,
  thread,
  ignoredMenuState,
  deletePermission,
  reportPermission,
  toggleIgnoredPermission,
  editPermission,
  reportClicked,
  deleteClicked,
  editClicked,
  toggleIgnored,
  number,
}) => {
  const userLinkClass = `user bn_thread-comment__user ${UserFavor ? 'bn_thread-comment__user--favor' : ''}`;
  return (
    <div className="bn_thread-comment__container">
      <div className="postInfo bn_display-flex  bn_thread-comment__infor-wrapper">
        <div className="bn_thread-comment__infor">
          <Link className={userLinkClass} to={`/user/${UserId}`}>
            {UserAlias}
          </Link>
          {' '}
          <span className="bn_thread-comment__date">
            ({dateToString(CreateDate)})
          </span>
        </div>
        <IfComponent
          condition={DeletionStatus === 0}
          whenTrue={
            <CommentItemRightMenu
              deletePermission={deletePermission}
              hasAccess={hasAccess}
              reportPermission={reportPermission}
              toggleIgnoredPermission={toggleIgnoredPermission}
              editPermission={editPermission}
              reportClicked={reportClicked}
              deleteClicked={deleteClicked}
              editClicked={editClicked}
              ignoredUser={ignoredUser}
              toggleIgnored={toggleIgnored}
              ignoredMenuState={ignoredMenuState}
              number={number}
            />
          }
          whenFalse={null}
        />
      </div>
      <CommentItemBodyContent
        Body={Body}
        DeletionStatus={DeletionStatus}
        Subject={Subject}
        ignoredUser={ignoredUser}
        thread={thread}
        ignoredMenuState={ignoredMenuState}
      />
    </div>
  );
};

CommentItemBody.propTypes = propTypes;
CommentItemBody.defaultProps = defaultProps;

export default CommentItemBody;
