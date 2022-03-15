import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { withRouter } from 'react-router-dom';
import isMobile from 'ismobilejs';

import TopBar from './TopBar';
import SearchResult from './SearchResult';
import SearchFilter from './SearchFilter';

import { Paging, VisibleWhen, LoadingAnimationComponent } from '../share';
import { doSearch, updateSearchConditions, goToSearchPage } from '../../actions';
import { scrollTop } from '../../utilities';

const propTypes = {
  query: PropTypes.string,
  totalPages: PropTypes.number,
  page: PropTypes.number,
  goToPage: PropTypes.func,
  onSearch: PropTypes.func,
  scrollHeight: PropTypes.number,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

const defaultProps = {
  query: '',
  totalPages: 0,
  page: 0,
  goToPage: () => { },
  onSearch: () => { },
  scrollHeight: 500,
  history: {},
};

const Search = ({ query, totalPages, page, goToPage, onSearch, scrollHeight }) => {
  const resultComponent = (
    <LoadingAnimationComponent>
      <SearchResult />
    </LoadingAnimationComponent>
  );
  const searchResult = isMobile.phone ? resultComponent : (
    <Scrollbars style={{ height: scrollHeight }}>
      {resultComponent}
    </Scrollbars>
  );

  return (
    <div className="bn_search">
      <TopBar searchText={query} />
      <div className="searchResults bn_search bn_main__wrapper">
        <SearchFilter onSearch={(q, opts) => onSearch(q, query, opts)} />
        {searchResult}
      </div>
      <VisibleWhen when={totalPages > 0}>
        <Paging goToPage={goToPage} currentThreadIndex={page} totalPages={totalPages} />
      </VisibleWhen>
    </div>
  );
};

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;


const mapStateToProps = state => ({
  query: state.search.query,
  totalPages: state.search.totalPages,
  page: state.search.page,
  scrollHeight: state.app.columnHeight + 49,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSearch: (query, oldQuery, options) => {
    const modifiedOptions = options;
    modifiedOptions.page = 1;
    dispatch(updateSearchConditions(query, modifiedOptions));
    if (query !== oldQuery) {
      ownProps.history.push(`/search?query=${query}`);
    } else {
      dispatch(doSearch());
    }
  },
  goToPage: (page) => {
    dispatch(goToSearchPage(page));
    dispatch(doSearch());
    if (isMobile.phone) {
      scrollTop();
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Search));
