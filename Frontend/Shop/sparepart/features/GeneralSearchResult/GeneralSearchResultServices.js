import Http from '../../../core/scripts/ultis/Http';
import { API_PART } from '../../../core/scripts/constants';

class GeneralSearchResultServices extends Http {
  fetchData = (body) => this.post(`${API_PART}/global-search`, body, true);
}

export default new GeneralSearchResultServices();
