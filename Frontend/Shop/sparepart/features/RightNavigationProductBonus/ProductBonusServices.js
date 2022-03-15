import Http from '../../../core/scripts/ultis/Http';
import { API_RIGHT_NAVIGATION_PRODUCT_BONUS } from '../../../core/scripts/constants/index';

class ProductBonusServices extends Http {
  getContent = () => this.get(API_RIGHT_NAVIGATION_PRODUCT_BONUS);
}

export default new ProductBonusServices();
