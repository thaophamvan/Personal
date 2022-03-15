import { connect } from 'react-redux';
import Suggestions from '../Suggestions';

const mapSuggestions = suggestions => suggestions.map(item => ({
  text: item.Alias,
  value: `/user/${item.UserId}`,
}));


const mapStateToProps = (state, ownProps) => ({
  items: mapSuggestions(state.search.suggestions),
  isVisible: ownProps.isVisible && state.search.suggestions.length > 0,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Suggestions);
