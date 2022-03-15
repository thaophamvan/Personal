import React from 'react';
import PropTypes from 'prop-types';

import { formatDateTime } from '../../utilities';

function getRoundedPercentStr(percentOfTotal) {
  return Math.round(percentOfTotal * 100) / 100;
}

const propTypes = {
  activeForums: React.PropTypes.arrayOf(PropTypes.shape({
    Date: PropTypes.string,
    Count: PropTypes.number,
    PercentOfTotal: PropTypes.number,
  })),
};

const defaultProps = {
  activeForums: [],
};

const UserActivities = ({ activeForums }) =>
  (
    <div>
      <h2>Aktivitet</h2>
      <table className="bn_profile__list">
        <thead>
          <tr>
            <th>Månad / antal</th>
            <th>Inlägg, % av totalt antal skrivna</th>
          </tr>
        </thead>
        <tbody>
          {
            [...activeForums].map((forum, i) => (
              <tr key={forum.Date}>
                <td>{formatDateTime(forum.Date, 'YYYY-MM')} / {forum.Count}</td>
                <td>{getRoundedPercentStr(forum.PercentOfTotal)}%</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );

UserActivities.propTypes = propTypes;
UserActivities.defaultProps = defaultProps;

export default UserActivities;
