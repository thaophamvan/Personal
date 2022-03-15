import Http from '../../../core/scripts/ultis/Http';
import { API_PART } from '../../../core/scripts/constants';

class ProductListServices extends Http {
  fetchData = (body) => this.post(`${API_PART}/part-search`, body, true);
}

export default new ProductListServices();
