import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const propTypes = {
  orderNo: PropTypes.number,
  user: PropTypes.shape({
    UserId: PropTypes.number,
    Number: PropTypes.number,
    UserAlias: PropTypes.string,
    MessageCount: PropTypes.number,
    UserFavor: PropTypes.bool,
  }),
};

const defaultProps = {
  orderNo: 0,
  user: {},
};

const getUserAlias = (isFavor, userAlias) =>
  (isFavor ? (<span className="bn_statistic__link--favor">{userAlias}</span>) : userAlias);

const MostUserItem = ({ orderNo, user }) =>
  (
    <li className="bn_statistic-most__item">
      <div className="bn_statistic-most__label">
        <Link
          to={`/user/${user.UserId}`}
          className="bn_statistic__link"
        >
          {(orderNo + 1)}. {getUserAlias(user.UserFavor, user.UserAlias)}
        </Link>
      </div>
    </li>
  );

MostUserItem.propTypes = propTypes;
MostUserItem.defaultProps = defaultProps;

export default MostUserItem;
