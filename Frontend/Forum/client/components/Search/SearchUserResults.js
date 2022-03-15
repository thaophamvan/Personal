import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { userInArray } from '../../utilities';

const propTypes = {
  users: React.PropTypes.arrayOf(PropTypes.shape({
    UserId: PropTypes.number,
    Alias: PropTypes.string,
    Role: PropTypes.string,
    UserFavor: PropTypes.bool,
  })),
  totalUserCount: PropTypes.number,
  favoritesUser: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  users: [],
  totalUserCount: 0,
  favoritesUser: [],
};

const getRoleOneChar = role => role.charAt(0);

const getUserClass = (users, userId) => {
  const isFavor = userInArray(users, userId);
  return `userResult bn_search-result-user__link ${(isFavor ? 'bn_search-result-user__link--favor' : '')}`;
};

const SearchUserResults = ({ users, totalUserCount, favoritesUser }) => (
  <div className="bn_search-result-user simpleSearch">
    <h3 className="bn_search-result__title">Användare
      <span className="subText bn_search-result__count">({totalUserCount})</span>
    </h3>
    <ul className="bn_search-result__list">
      {
        users.map((user, i) => (
          <li className="userHit bn_search-result-user__item" key={user.UserId}>
            <Link
              to={`/user/${user.UserId}`}
              className={getUserClass(favoritesUser, user.UserId)}
            >
              {user.Alias}
            </Link>
            <span className="statusResult bn_search-result-user__status">({getRoleOneChar(user.Role)})</span>
          </li>
        ))
      }
    </ul>
  </div>
);
SearchUserResults.propTypes = propTypes;
SearchUserResults.defaultProps = defaultProps;

export default SearchUserResults;
