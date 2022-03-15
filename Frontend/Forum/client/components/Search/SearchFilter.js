import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import SearchDateRange from './SearchDateRange';
import AdvancedFilter from './AdvancedFilter';
import { ConnectedSuggestions, TextInput } from '../share';
import { loadSearchSuggestions } from '../../actions';

import './SearchFilter.scss';

const propTypes = {
  onSearch: PropTypes.func,
  query: PropTypes.string,
  fromDate: PropTypes.shape({}),
  toDate: PropTypes.shape({}),
  page: PropTypes.number,
  exactly: PropTypes.bool,
  type: PropTypes.string,
  onLoadSuggestions: PropTypes.func,
};

const defaultProps = {
  onSearch: () => { },
  query: '',
  fromDate: null,
  toDate: null,
  page: 0,
  exactly: false,
  type: '',
  onLoadSuggestions: () => { },
};

class SearchFilter extends React.Component {
  constructor(props) {
    super(props);
    const { query, fromDate, toDate, page, exactly, type } = this.props;

    this.setupState = this.setupState.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.searchExactlyOnChange = this.searchExactlyOnChange.bind(this);
    this.searchTypeOnChange = this.searchTypeOnChange.bind(this);
    this.hideSuggestions = this.hideSuggestions.bind(this);
    this.searchTextChanged = this.searchTextChanged.bind(this);
    this.performSearch = this.performSearch.bind(this);
    this.setupState(query, fromDate, toDate, page, exactly, type);
  }
  componentWillReceiveProps(nextProps) {
    const { query, fromDate, toDate, page, exactly, type } = nextProps;
    this.setupState(query, fromDate, toDate, page, exactly, type);
  }
  onDatesChange({ startDate, endDate }) {
    const fromDate = startDate;
    const toDate = endDate;
    this.setState({
      fromDate,
      toDate,
    });
  }
  setupState(query, fromDate, toDate, page, exactly, type) {
    const showSuggestion = false;
    this.state = {
      fromDate,
      toDate,
      forumId: 0,
      userId: 0,
      page,
      query,
      exactly,
      type,
      showSuggestion,
    };
  }
  searchExactlyOnChange() {
    const { exactly } = this.state;
    this.setState({ exactly: !exactly });
  }
  searchTypeOnChange(type) {
    this.setState({ type });
  }
  hideSuggestions() {
    this.setState({
      showSuggestion: false,
    });
  }
  performSearch() {
    const { onSearch } = this.props;
    const {
      fromDate,
      toDate,
      forumId,
      userId,
      page,
      query,
      exactly,
      type,
    } = this.state;
    onSearch(query, {
      fromDate,
      toDate,
      forumId,
      userId,
      page,
      exactly,
      type,
    });
  }
  searchTextChanged(evt) {
    const query = evt.target.value;
    this.setState({
      query,
      showSuggestion: true,
    });
    this.props.onLoadSuggestions(query);
  }
  render() {
    const { fromDate, toDate, exactly, type, query, showSuggestion } = this.state;
    return (
      <div className="bn_search-filter">
        <div className="bn_search-filter__panel">
          <TextInput
            onChange={this.searchTextChanged}
            className="bn_search-filter__query"
            placeholder="Sök"
            value={query}
            onEnter={() => { this.performSearch(); this.hideSuggestions(); }}
          />
          <ConnectedSuggestions
            onItemClick={this.hideSuggestions}
            isVisible={showSuggestion}
            clickOutSide={this.hideSuggestions}
            className="suggestions--search-page"
          />
          <button
            type="button"
            onClick={this.performSearch}
            className="bn_search-filter__submit"
          >Ny sökning</button>
        </div>
        <div className="datePickerWrapper bn_search-datepicker bn_display-flex">
          <SearchDateRange
            initialStartDate={fromDate}
            initialEndDate={toDate}
            onDatesChange={this.onDatesChange}
          />
        </div>
        <AdvancedFilter
          searchExactlyOnChange={this.searchExactlyOnChange}
          searchTypeOnChange={this.searchTypeOnChange}
          searchExactly={exactly}
          searchType={type}
        />
      </div>
    );
  }
}

SearchFilter.propTypes = propTypes;
SearchFilter.defaultProps = defaultProps;

const mapStateToProps = state => ({
  query: state.search.query,
  fromDate: state.search.fromDate,
  toDate: state.search.toDate,
  type: state.search.type,
  exactly: state.search.exactly,
});

const mapDispatchToProps = dispatch => ({
  onLoadSuggestions: value => dispatch(loadSearchSuggestions(value)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchFilter));
