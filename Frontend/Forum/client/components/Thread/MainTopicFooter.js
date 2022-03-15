import React from 'react';
import PropTypes from 'prop-types';

import { HideMobile } from '../share';
import MainTopicOptions from './MainTopicOptions';
import CommentFilterButtons from './CommentFilterButtons';

const propTypes = {
  editPermission: PropTypes.bool,
  reportPermission: PropTypes.bool,
  commentPermission: PropTypes.bool,
  editClicked: PropTypes.func,
  reportClicked: PropTypes.func,
  commentClicked: PropTypes.func,
  hasAccess: PropTypes.bool,
  toggleShowUnreadComments: PropTypes.func,
  commentOptions: PropTypes.shape({}),
};

const defaultProps = {
  editPermission: false,
  reportPermission: false,
  commentPermission: false,
  editClicked: () => { },
  reportClicked: () => { },
  commentClicked: () => { },
  hasAccess: false,
  toggleShowUnreadComments: () => { },
  commentOptions: {},
};

const MainTopicFooter = ({ editPermission, reportPermission, commentPermission,
  commentClicked, editClicked, reportClicked, hasAccess, toggleShowUnreadComments,
  commentOptions }) =>
  (
    <div className="bn_thread-footer bn_display-flex">
      <HideMobile>
        <MainTopicOptions
          editPermission={editPermission}
          commentPermission={commentPermission}
          reportPermission={reportPermission}
          editClicked={editClicked}
          reportClicked={reportClicked}
          commentClicked={commentClicked}
          hasAccess={hasAccess}
        />
      </HideMobile>
      <CommentFilterButtons
        commentOptions={commentOptions}
        toggleShowUnreadComments={toggleShowUnreadComments}
        hasAccess={hasAccess}
      />
    </div>
  );

MainTopicFooter.propTypes = propTypes;
MainTopicFooter.defaultProps = defaultProps;

export default MainTopicFooter;
