import React from 'react';
import PropTypes from 'prop-types';

import MostUserItem from './MostUserItem';

const propTypes = {
  statisticUsers: React.PropTypes.arrayOf(PropTypes.shape({
    UserId: PropTypes.number,
    Number: PropTypes.number,
    UserAlias: PropTypes.string,
    MessageCount: PropTypes.number,
    UserFavor: PropTypes.bool,
  })),
};

const defaultProps = {
  statisticUsers: [],
};

const MostUserWeek = ({ statisticUsers }) =>
  (
    <div className="bn_statistic-most__block">
      <div className="bn_statistic-most__header">Mest aktiva användarna de senaste 7 dagarna:</div>
      <ul className="bn_statistic-most__list">
        {
          [...statisticUsers].map((user, i) => (
            <MostUserItem
              key={user.UserId}
              orderNo={i}
              user={user}
            />
          ))
        }
      </ul>
    </div>
  );

MostUserWeek.propTypes = propTypes;
MostUserWeek.defaultProps = defaultProps;

export default MostUserWeek;
