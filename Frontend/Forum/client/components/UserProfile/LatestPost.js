import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getForumLink } from '../../utilities';
import { filterByUser } from '../../actions';

const propTypes = {
  activeForums: React.PropTypes.arrayOf(PropTypes.shape({
    Id: PropTypes.string,
    Name: PropTypes.string,
    Count: PropTypes.number,
  })),
  alias: PropTypes.string,
  UserId: PropTypes.number,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
  })),
  filterByUserClicked: PropTypes.func,
};

const defaultProps = {
  activeForums: [],
  alias: '',
  menuItems: [],
  UserId: 0,
  filterByUserClicked: () => {},
};

const LatestPost = ({ activeForums, alias, menuItems, UserId, filterByUserClicked }) => (
  <div className="filterBar bn_profile-filter">
    <h2>{alias}&#39;s senaste inlägg:</h2>
    <ul className="first">
      {
        activeForums.map(forum => (
          <li key={forum.Id}>
            <Link
              onClick={() => filterByUserClicked(alias, UserId)}
              to={`/${getForumLink(+forum.Id, menuItems)}`}
              className="activeForums"
            >
              {forum.Name} ({forum.Count})
            </Link>
          </li>
        ))
      }
    </ul>
  </div>
);

LatestPost.propTypes = propTypes;
LatestPost.defaultProps = defaultProps;

const mapStateToProps = state => ({
  menuItems: state.app.menuItems,
});


const mapDispatchToProps = dispatch => ({
  filterByUserClicked: (alias, userId) => {
    dispatch(filterByUser(userId, alias));
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(LatestPost);
