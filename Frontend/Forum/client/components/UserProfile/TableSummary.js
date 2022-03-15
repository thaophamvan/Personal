import React from 'react';
import PropTypes from 'prop-types';

import { formatDateTime } from '../../utilities';

const propTypes = {
  DateCreated: PropTypes.string,
  VisitCount: PropTypes.number,
  LogTime: PropTypes.shape({}),
  LastVisit: PropTypes.string,
  ThreadCount: PropTypes.number,
  MessageCount: PropTypes.number,
  InfoReadCount: PropTypes.number,
  Alias: PropTypes.string,
  IsFavoriteCount: PropTypes.number,
};

const getLoggedTimeStr = (timespan) => {
  const hourText = timespan.TotalHours !== 1 ? ' timmar, ' : ' timme, ';
  const minuteText = timespan.Minutes !== 1 ? ' minuter, ' : ' minut, ';
  const secondText = timespan.Seconds !== 1 ? ' sekunder.' : ' sekund.';

  return parseInt(timespan.TotalHours, 0) +
    hourText + timespan.Minutes + minuteText +
    timespan.Seconds + secondText;
};

const defaultProps = {
  DateCreated: '',
  VisitCount: 0,
  LogTime: null,
  LastVisit: '',
  ThreadCount: '',
  MessageCount: '',
  InfoReadCount: '',
  Alias: '',
  IsFavoriteCount: '',
};

const TableSummary = ({ DateCreated, VisitCount, LogTime, ThreadCount,
  MessageCount, InfoReadCount, Alias, IsFavoriteCount, LastVisit }) =>
  (
    <table className="bn_profile__list">
      <tbody>
        <tr>
          <td>Skapad</td>
          <td>{formatDateTime(DateCreated, 'YYYY-MM-DD HH:mm:ss')}</td>
        </tr>
        <tr>
          <td>Inloggningar:</td>
          <td>{VisitCount}</td>
        </tr>
        <tr>
          <td>Inloggad tid:</td>
          <td>{getLoggedTimeStr(LogTime)}</td>
        </tr>
        <tr>
          <td>Senast inne:</td>
          <td>{formatDateTime(LastVisit, 'YYYY-MM-DD HH:mm:ss')}</td>
        </tr>
        <tr>
          <td>Inlägg/kommentarer:</td>
          <td>{ThreadCount} / {MessageCount}</td>
        </tr>
        <tr>
          <td>Antal läsare av info:</td>
          <td>{InfoReadCount}</td>
        </tr>
        <tr>
          <td>Antal som har {Alias} som favorit:</td>
          <td>{IsFavoriteCount}</td>
        </tr>
      </tbody>
    </table>
  );

TableSummary.propTypes = propTypes;
TableSummary.defaultProps = defaultProps;

export default TableSummary;
