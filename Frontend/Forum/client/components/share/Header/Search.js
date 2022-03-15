import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { loadSearchSuggestions, clearSearchSuggestions } from '../../../actions';

import ConnectedSuggestions from '../ConnectedSuggestions';
import TextInput from '../TextInput';

const propTypes = {
  onLoadSuggestions: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

const defaultProps = {
  onLoadSuggestions: () => { },
  history: {},
};

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      query: '',
      showSuggestion: false,
      autoFocus: false,
    };

    this.toggleSearchBox = this.toggleSearchBox.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.hideSuggestions = this.hideSuggestions.bind(this);
    this.onSearchTextChange = this.onSearchTextChange.bind(this);
  }
  onSearchTextChange(evt) {
    const query = evt.target.value;
    this.setState({
      query,
      showSuggestion: true,
    });
    this.props.onLoadSuggestions(query);
  }
  toggleSearchBox() {
    const { isExpanded, query } = this.state;
    if (query !== '' && isExpanded) {
      this.doSearch();
    } else {
      this.setState({
        isExpanded: !isExpanded,
        autoFocus: !isExpanded,
      });
    }
  }
  doSearch() {
    const { query } = this.state;
    if (query !== '') {
      this.props.history.push({
        pathname: '/search',
        search: `?query=${query}`,
      });
    }
    this.setState({
      autoFocus: false,
    });
  }
  hideSuggestions() {
    this.setState({
      showSuggestion: false,
    });
  }
  render() {
    const { isExpanded, query, showSuggestion, autoFocus } = this.state;
    const expandStatus = isExpanded ? 'expanded' : '';
    return (
      <section className="bn_header-search">
        <div>
          <i
            role="button"
            onClick={this.toggleSearchBox}
            className={`bn_header-search__expand material-icons ${expandStatus}`}
            tabIndex="-1"
          >search</i>
          <div className={`bn_header-search__box ${expandStatus}`}>
            <TextInput
              className="bn_header-search__input"
              type="search"
              value={query}
              placeholder="Sök..."
              onChange={this.onSearchTextChange}
              onEnter={() => { this.doSearch(); this.hideSuggestions(); }}
              autoFocus={autoFocus}
            />
            <ConnectedSuggestions
              onItemClick={this.hideSuggestions}
              isVisible={showSuggestion}
              clickOutSide={this.hideSuggestions}
            />
          </div>
        </div>
      </section>
    );
  }
}

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  onLoadSuggestions: value => dispatch(loadSearchSuggestions(value)),
  onClearSuggestions: () => dispatch(clearSearchSuggestions()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search));
