import Http from '../../../core/scripts/ultis/Http';
import { API_RIGHT_NAVIGATION_PRODUCT_BUNDLE } from '../../../core/scripts/constants/index';

class ProductBundleServices extends Http {
  getContent = () => this.get(API_RIGHT_NAVIGATION_PRODUCT_BUNDLE);
}

export default new ProductBundleServices();
