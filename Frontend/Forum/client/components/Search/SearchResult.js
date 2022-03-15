import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { loadSearchExecute } from '../../actions';

import SearchUserResults from './SearchUserResults';
import SearchThreadResults from './SearchThreadResults';
import { VisibleWhen } from '../share';

const propTypes = {
  searchResults: PropTypes.shape({}),
  menuItems: PropTypes.arrayOf(PropTypes.shape({})),
  favoritesUser: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  searchResults: {
    TotalUserCount: 0,
    Users: [],
    TotalThreadCount: 0,
    Threads: [],
  },
  menuItems: [],
  favoritesUser: [],
};

const SearchResult = ({ searchResults, menuItems, favoritesUser }) => {
  const searchUserResultVisible = searchResults && searchResults.Users != null;

  const searchThreadResultVisible = searchResults && searchResults.Threads != null;
  return (
    <div className="bn_search-result">
      <VisibleWhen when={searchUserResultVisible}>
        <SearchUserResults
          users={searchResults.Users}
          totalUserCount={searchResults.TotalUserCount}
          favoritesUser={favoritesUser}
        />
      </VisibleWhen>
      <VisibleWhen when={searchThreadResultVisible}>
        <SearchThreadResults
          menuItems={menuItems}
          threads={searchResults.Threads}
          totalThreadCount={searchResults.TotalThreadCount}
          favoritesUser={favoritesUser}
        />
      </VisibleWhen>
    </div>
  );
};

SearchResult.propTypes = propTypes;
SearchResult.defaultProps = defaultProps;

const mapStateToProps = state => ({
  searchResults: state.search.results,
  menuItems: state.app.menuItems,
  favoritesUser: state.user.favorites.Favorites,
  scrollHeight: (state.app.columnHeight >> 0) + 49,
});

const mapDispatchToProps = dispatch => ({
  onSearchExecute: filters => dispatch(loadSearchExecute(filters)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
