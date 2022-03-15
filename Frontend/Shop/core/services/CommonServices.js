import Http from '../scripts/ultis/Http';
import { API_CONTENT_NAVIGATION, API_SIGNUP_NEWSLETTER, API_GET_STATE_LIST } from '../scripts/constants';

class CommonServices extends Http {
  fetchNavigation = () => this.get(API_CONTENT_NAVIGATION);

  signUpNewsletter = (params) => this.post(`${API_SIGNUP_NEWSLETTER}?${params}`);

  fecthStateList = (params) => this.get(`${API_GET_STATE_LIST}?countryCode=${params}`);
}

export default new CommonServices();
