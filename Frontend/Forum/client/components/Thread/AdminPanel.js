import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AdminPanelMoveDropDown from './AdminPanelMoveDropDown';
import AdminReportPanel from './AdminReportPanel';
import { VisibleWhen } from '../share';
import { getForumOptions } from '../../utilities';
import { adminMoveThread, adminClearReportedMessages } from '../../actions';

const propTypes = {
  menuItems: PropTypes.arrayOf(PropTypes.shape({

  })),
  selectedForum: PropTypes.string,
  moveThread: PropTypes.func,
  clearReportedMessages: PropTypes.func,
  selectedThread: PropTypes.number,
  reportedMessages: PropTypes.arrayOf(PropTypes.shape({})),
  reportItemClick: PropTypes.func,
};

const defaultProps = {
  menuItems: [],
  selectedForum: '',
  selectedThread: 0,
  moveThread: () => { },
  clearReportedMessages: () => { },
  reportedMessages: [],
  reportItemClick: () => { },
};

class AdminPanel extends React.Component {
  constructor(props) {
    super(props);
    const { menuItems, selectedForum } = props;
    const forumOptions = getForumOptions(menuItems, selectedForum);
    const selectedChangeForum = forumOptions[0].value;
    this.state = {
      forumOptions,
      selectedChangeForum,
    };
    this.forumOptionsChanged = this.forumOptionsChanged.bind(this);
  }
  forumOptionsChanged(selection) {
    console.log(selection);
    this.setState({
      selectedChangeForum: selection.value,
    });
  }

  render() {
    const { forumOptions, selectedChangeForum } = this.state;
    const { moveThread,
      selectedThread,
      reportedMessages,
      clearReportedMessages,
      reportItemClick,
    } = this.props;
    const reportedVisible = reportedMessages && reportedMessages.length > 0;
    return (
      <div id="adminWidget" className="bn-thread__admin">
        <div className="move bn_forums-filter__wrapper bn_display-flex">
          <div className="bn_forums-filter__title">Flytta tråden till:</div>
          <AdminPanelMoveDropDown
            forumOptions={forumOptions}
            forumOptionChanged={this.forumOptionsChanged}
          />
          <input
            onClick={() => { moveThread(selectedThread, selectedChangeForum); }}
            type="button"
            className="button bn_forums-filter__move"
            value="Flytta"
          />
        </div>
        <VisibleWhen when={reportedVisible}>
          <AdminReportPanel
            ReportedComments={reportedMessages}
            clearReported={clearReportedMessages}
            reportItemClick={reportItemClick}
          />
        </VisibleWhen>
      </div>
    );
  }
}

AdminPanel.propTypes = propTypes;
AdminPanel.defaultProps = defaultProps;

const mapStateToProps = state => ({
  menuItems: state.app.menuItems,
  selectedForum: state.app.selectedForum,
  selectedThread: state.leftColumn.selectedThread,
  reportedMessages: state.admin.reportedMessages,
});

const mapDispatchToProps = dispatch => ({
  moveThread: (forumId, threadId) => { dispatch(adminMoveThread(forumId, threadId)); },
  clearReportedMessages: (threadId) => { dispatch(adminClearReportedMessages()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);
