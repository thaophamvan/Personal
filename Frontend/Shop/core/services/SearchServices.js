import Http from '../scripts/ultis/Http';
import { API_SUGGESTION_SEARCH_GLOBAL, API_PART, B2B_API_PART_SEARCH, VINTEC_API_SUGGESTION_SEARCH_GLOBAL } from '../scripts/constants';

class SearchServices extends Http {
  searchParts = (params) => this.get(`${API_PART}/View?${params}`);

  searchVintecParts = (params) => this.get(`${API_PART}/vintec-part-search?${params}`);

  searchPartsB2B = (params) => this.get(`${B2B_API_PART_SEARCH}?searchtext=${params}`);

  searchPartsByCategory = (params) => this.get(`${API_PART}/View/${params}`);

  fetchSuggestions = (text, page) => this.get(`${API_SUGGESTION_SEARCH_GLOBAL}?searchtext=${text}&page=${page}`, true);

  fetchSuggestionsVintec = (text) => this.get(`${VINTEC_API_SUGGESTION_SEARCH_GLOBAL}?searchtext=${text}`, true);
}
export default new SearchServices();
