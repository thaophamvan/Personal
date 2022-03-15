import Http from '../../scripts/ultis/Http';
import { API_SPARE_PARTS } from '../../scripts/constants/index';

class PromotionalBannerServices extends Http {
  applyPromotionCode = (body) => this.post(`${API_SPARE_PARTS}/addinstantpromotioncode`, body);
}

export default new PromotionalBannerServices();
