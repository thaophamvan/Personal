import React from 'react';
import PropTypes from 'prop-types';

import { IfComponent, VisiblityByAccess } from '../share';
import CommentItemRightMenu from './CommentItemRightMenu';

const propTypes = {
  hasAccess: PropTypes.bool,
  editPermission: PropTypes.bool,
  reportPermission: PropTypes.bool,
  toggleIgnoredPermission: PropTypes.bool,
  deletePermission: PropTypes.bool,
  editClicked: PropTypes.func,
  reportClicked: PropTypes.func,
  deleteClicked: PropTypes.func,
  ignoredUser: PropTypes.bool,
  toggleIgnored: PropTypes.func,
  ignoredMenuState: PropTypes.bool,
  onReplyCommentClick: PropTypes.func,
  hiddenReplyButton: PropTypes.bool,
  hiddenRightMenu: PropTypes.bool,
};

const defaultProps = {
  hasAccess: false,
  editPermission: false,
  reportPermission: false,
  toggleIgnoredPermission: false,
  deletePermission: false,
  editClicked: () => { },
  reportClicked: () => { },
  deleteClicked: () => { },
  ignoredUser: false,
  toggleIgnored: () => { },
  ignoredMenuState: false,
  onReplyCommentClick: () => { },
  hiddenReplyButton: false,
  hiddenRightMenu: false,
};

const CommentItemOptions = ({
  hasAccess,
  editPermission,
  reportPermission,
  toggleIgnoredPermission,
  deletePermission,
  editClicked,
  reportClicked,
  deleteClicked,
  ignoredUser,
  toggleIgnored,
  ignoredMenuState,
  onReplyCommentClick,
  hiddenReplyButton,
  hiddenRightMenu }) =>
  (
    <VisiblityByAccess hasAccess={hasAccess} className="bn_thread-comment__options">
      <a
        role="button"
        tabIndex="-1"
        className="hidden bn_thread-comment__options__icon bn_thread-comment__options__like"
      >&nbsp;</a>
      <IfComponent
        condition={hiddenReplyButton}
        whenTrue={null}
        whenFalse={
          <a
            className="bn_thread-comment__options__icon bn_thread-comment__options__comment"
            role="button"
            tabIndex="-1"
            onClick={onReplyCommentClick}
          >&nbsp;</a>
        }
      />
      <IfComponent
        condition={hiddenRightMenu}
        whenTrue={null}
        whenFalse={
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
          />
        }
      />
    </VisiblityByAccess>
  );

CommentItemOptions.propTypes = propTypes;
CommentItemOptions.defaultProps = defaultProps;

export default CommentItemOptions;
