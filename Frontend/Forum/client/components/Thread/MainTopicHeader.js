import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { VisiblityByAccess, HideMobile, ShowMobile } from '../share';
import MainTopicRightMenu from './MainTopicRightMenu';
import MainTopicOptions from './MainTopicOptions';
import ToggleFollowButton from './ToggleFollowButton';
import { dateToString } from '../../utilities';

const propTypes = {
  className: PropTypes.string,
  editPermission: PropTypes.bool,
  reportPermission: PropTypes.bool,
  commentPermission: PropTypes.bool,
  editClicked: PropTypes.func,
  reportClicked: PropTypes.func,
  commentClicked: PropTypes.func,
  UserAlias: PropTypes.string,
  UserFavor: PropTypes.bool,
  CreateDate: PropTypes.string,
  MessageCount: PropTypes.number,
  UserId: PropTypes.number,
  hasAccess: PropTypes.bool,
  isFollowEnable: PropTypes.bool,
  onFollow: PropTypes.func,
  onUnFollow: PropTypes.func,
};

const defaultProps = {
  className: '',
  editPermission: false,
  reportPermission: false,
  commentPermission: false,
  editClicked: () => { },
  reportClicked: () => { },
  commentClicked: () => { },
  UserAlias: '',
  UserFavor: false,
  CreateDate: '',
  MessageCount: 0,
  UserId: 0,
  hasAccess: false,
  isFollowEnable: true,
  onFollow: () => { },
  onUnFollow: () => { },
};

const getUserLink = isFavor =>
  `user bn_thread-header__user-label ${isFavor ? 'bn_thread-header__user-label--favor' : ''}`;

const MainTopicHeader = ({ className, editPermission, reportPermission,
  commentPermission, commentClicked, reportClicked, editClicked, onFollow, onUnFollow,
  UserAlias, UserFavor, CreateDate, MessageCount, UserId, hasAccess, isFollowEnable }) =>
  (
    <div className="bn_thread-header bn_display-flex">
      <ShowMobile>
        <MainTopicOptions
          editPermission={editPermission}
          commentPermission={commentPermission}
          reportPermission={reportPermission}
          editClicked={editClicked}
          reportClicked={reportClicked}
          commentClicked={commentClicked}
          hasAccess={hasAccess}
        />
      </ShowMobile>
      <div className="bn_thread-header__user">
        <Link className={getUserLink(UserFavor)} to={`/user/${UserId}`}>
          {UserAlias}
        </Link>
        <span className="bn_thread-header__user-date">
          {dateToString(CreateDate)}
        </span>
      </div>
      <div className="bn_thread-header__aside bn_display-flex">
        <span className="bn_thread-header__comment-answers hidden-mobile">{MessageCount} kommentarer</span>
        <VisiblityByAccess hasAccess={hasAccess} >
          <HideMobile>
            <ToggleFollowButton
              isFollowEnable={isFollowEnable}
              onFollow={onFollow}
              onUnFollow={onUnFollow}
            />
          </HideMobile>
          <MainTopicRightMenu
            editPermission={editPermission}
            commentPermission={commentPermission}
            reportPermission={reportPermission}
            editClicked={editClicked}
            reportClicked={reportClicked}
            commentClicked={commentClicked}
          />
        </VisiblityByAccess>
      </div>
    </div>
  );
MainTopicHeader.propTypes = propTypes;
MainTopicHeader.defaultProps = defaultProps;

export default MainTopicHeader;
