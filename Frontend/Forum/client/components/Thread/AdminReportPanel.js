import React, { PropTypes } from 'react';

import AdminReportItem from './AdminReportItem';

const propTypes = {
  ReportedComments: PropTypes.arrayOf(PropTypes.shape({
  })),
  clearReported: PropTypes.func,
  reportItemClick: PropTypes.func,
};

const defaultProps = {
  ReportedComments: [],
  clearReported: () => { },
  reportItemClick: () => { },
};

const AdminReportPanel = ({ ReportedComments, clearReported, reportItemClick }) => (
  <div className="bn-thread__admin-reported">
    <h2>Anmälningar</h2>
    <table className="bn_thread-admin__reported">
      <tbody>
        <tr>
          <th>Meddelande</th>
          <th>Gå till kommentar</th>
          <th>Inskickat av:</th>
        </tr>
        {
          [...ReportedComments].map((item, i) => (
            <AdminReportItem
              key={`${item.MessageId}_${item.ReportingUserId}`}
              item={item}
              reportItemClick={reportItemClick}
            />
          ))
        }
      </tbody>
    </table>
    <input
      type="button"
      onClick={clearReported}
      className="bn_thread-admin__reported-clear"
      value="Rensa listan"
    />
  </div>
);

AdminReportPanel.propTypes = propTypes;
AdminReportPanel.defaultProps = defaultProps;

export default AdminReportPanel;
