import Http from '../scripts/ultis/Http';
import { API_LOCATION_SUGGESTION } from '../scripts/constants';

class LocationServices extends Http {
  fetchSuggestions = (text, page, { stateOnly }) => this.get(`${API_LOCATION_SUGGESTION}?text=${text}&page=${page}&stateOnly=${stateOnly}`, true);
}

export default new LocationServices();
