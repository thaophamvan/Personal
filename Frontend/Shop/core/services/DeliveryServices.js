import Http from '../scripts/ultis/Http';
import { API_DELIVERY_POPUP, API_POSTCODE_PRODUCT, API_PICKUP_LOCATION } from '../scripts/constants';

class DeliveryServices extends Http {
  fetchData = () => this.get(`${API_DELIVERY_POPUP}`, true);

  getLocationData = () => this.get(API_PICKUP_LOCATION);

  getProduct = (query) => this.get(`${API_POSTCODE_PRODUCT}?${query}`, true);
}

export default new DeliveryServices();
