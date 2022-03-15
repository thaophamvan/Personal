import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

import { getForumLink, dateToString, userInArray } from '../../utilities';

const propTypes = {
  threads: React.PropTypes.arrayOf(PropTypes.shape({
    Subject: PropTypes.string,
    ForumName: PropTypes.string,
    ThreadId: PropTypes.number,
    ForumId: PropTypes.number,
    UserId: PropTypes.number,
    Highlights: PropTypes.string,
    UserAlias: PropTypes.string,
    UserFavor: PropTypes.bool,
    CreateDate: PropTypes.string,
    MessageCount: PropTypes.number,
  })),
  totalThreadCount: PropTypes.number,
  menuItems: PropTypes.arrayOf(PropTypes.shape({})),
  favoritesUser: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  threads: [],
  totalThreadCount: 0,
  menuItems: [],
  favoritesUser: [],
};

const getUserClass = (users, userId) => {
  const isFavor = userInArray(users, userId);
  return `user bn_search-result-thread__link ${(isFavor ? 'bn_search-result-thread__link--favor' : '')}`;
};

const SearchThreadResults = ({ threads, totalThreadCount, menuItems, favoritesUser }) =>
  (
    <div className="threadResults bn_search-result-thread">
      <h3 className="bn_search-result__title">
        Trådar
        <span className="subText bn_search-result__count">({totalThreadCount})</span>
      </h3>
      <ul className="bn_search-result__list">
        {
          threads.map((thread, i) => (
            <li className="threadHit bn_search-result-thread__item first" key={thread.ThreadId}>
              <div className="bn_search-result-thread__block">
                <div className="topic">
                  <h4 className="bn_search-result-thread__title">Tråd:</h4>
                  <span className="subject">{thread.Subject}</span>
                  <span className="subText">({thread.MessageCount >= 0 ? thread.MessageCount : 0})</span>
                </div>
                <strong>Forum: </strong>
                <i>{thread.ForumName}</i>
                <p>
                  <Link
                    to={`/${getForumLink(thread.ForumId, menuItems, true)}/${thread.ThreadId}/`}
                    className="threadItem bn_search-result-thread__link"
                    dangerouslySetInnerHTML={{
                      __html: thread.Highlights,
                    }}
                  />
                </p>
              </div>
              <div className="bn_search-result-thread__date">
                <Link
                  to={`/user/${thread.UserId}`}
                  className={getUserClass(favoritesUser, thread.UserId)}
                >
                  {thread.UserAlias}
                </Link>
                <p className="time">{dateToString(thread.CreateDate)}</p>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  );
SearchThreadResults.propTypes = propTypes;
SearchThreadResults.defaultProps = defaultProps;

export default SearchThreadResults;
