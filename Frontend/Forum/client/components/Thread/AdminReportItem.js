import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

import './AdminReportItem.scss';

const propTypes = {
  item: PropTypes.shape({}),
  reportItemClick: PropTypes.func,
};

const defaultProps = {
  item: {},
  reportItemClick: () => { },
};

const AdminReportItem = ({ item, reportItemClick }) => (
  <tr className="reportedMessage">
    <td>{item.Motivation}</td>
    <td>
      <a
        role="button"
        tabIndex="-1"
        className="bn_thread-admin__reported-link"
        onClick={() => reportItemClick(item.MessageId)}
      >
        Se kommentar
      </a>
    </td>
    <td>
      <Link
        to={`/user/${item.ReportingUserId}`}
        className="userProfileLink"
      >
        {item.ReportingUserName}
      </Link>
    </td>
  </tr>
);

AdminReportItem.propTypes = propTypes;
AdminReportItem.defaultProps = defaultProps;

export default AdminReportItem;
