import Http from '../../../core/scripts/ultis/Http';
import { API_RIGHT_NAVIGATION_FIND_PNC } from '../../../core/scripts/constants/index';

class FindPncServices extends Http {
  getContent = () => this.get(API_RIGHT_NAVIGATION_FIND_PNC);

  getContentByCategory = (category) => this.get(`${API_RIGHT_NAVIGATION_FIND_PNC}/${category}`);
}

export default new FindPncServices();
