import mockAxios, { regexPath } from './mock';

import { API_SUGGESTION_SEARCH_GLOBAL } from '../scripts/constants';

import suggestionsSearch from './data/suggestions-search.json';

mockAxios.onGet(regexPath(`${API_SUGGESTION_SEARCH_GLOBAL}/[a-zA-Z0-9]+?page=[0-9]`)).reply(200, suggestionsSearch);
