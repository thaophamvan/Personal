import Http from '../scripts/ultis/Http';
import { API_PRODUCT_YOU_MAY_ALSO_LIKE, API_PART_RECOMMENDATION, B2B_API_GET_FREQUENTLY_ORDERED_PARTS, VINTEC_API_PART_RECOMMENDATION_PDP, VINTEC_API_PART_RECOMMENDATION_CART_PAGE } from '../scripts/constants';
import { filterBulkPrice } from '../../b2b/scripts/bulkPrice';

class ProductServices extends Http {
  fetchRecommendedProduct = (productCode, categoryId) => this.get(`${API_PRODUCT_YOU_MAY_ALSO_LIKE}?productCode=${productCode}&categoryId=${categoryId}`, true);

  fetchRecommendedPart = (partNumber, isWishlist = false) => {
    return this
      .get(`${API_PART_RECOMMENDATION}?partNumber=${partNumber}&isWishlist=${isWishlist}`)
      .then(result => {
        result.recommendations = filterBulkPrice(result.recommendations);
        return result;
      });
  }

  fetchFrequentlyOrdered = () => {
    return this
      .get(B2B_API_GET_FREQUENTLY_ORDERED_PARTS)
      .then(result => {
        result.recommendations = filterBulkPrice(result.recommendations);
        return result;
      });
  }

  vintecFetchRecommendedPartPdp = (partNumber) => this.get(`${VINTEC_API_PART_RECOMMENDATION_PDP}?partNumber=${partNumber}`);
  vintecFetchRecommendedPartCartPage = (partNumber) => this.get(`${VINTEC_API_PART_RECOMMENDATION_CART_PAGE}?partNumber=${partNumber}`);
  vintecFetchRecommendedPartBrandPage = (partNumber) => this.get(`${VINTEC_API_PART_RECOMMENDATION_BRAND_PAGE}?partNumber=${partNumber}`);
}

export default new ProductServices();
