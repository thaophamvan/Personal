import Http from '../scripts/ultis/Http';
import {
  API_ADD_TO_CART,
  API_CART_COUNT,
  API_CART,
  API_CART_UPDATE,
  API_PRODUCT_CUSTOMER_CARE,
  API_PRODUCT_DELIVERY,
  API_DELIVERY,
  API_SUBMIT_SHOPPING_CART,
  API_CART_GET_DELIVERY,
  API_APPLY_PROMOTION_CODE,
  API_REMOVE_PROMOTION_CODE,
  API_SPARE_PARTS_CART,
  API_CART_ADD_MULTIPLE,
  API_PART_REQUEST_ELIGIBLE_PRICE,
  B2B_API_SAVE_CART_AND_GO_TO_CHECKOUT,
  B2B_API_CART_ADD_MULTIPLE,
} from '../scripts/constants';
import simpleNotify from '../scripts/ultis/simpleNotify';

class CartService extends Http {
  addSkuToCart(skuCode, amount, recurringPlanID = '') {
    const data = { code: skuCode, quantity: amount, recurringPlanID };
    return this.post(API_ADD_TO_CART, data);
  }

  getCartQuantity = () => this.get(`${API_CART_COUNT}?t=${new Date().getTime()}`);

  getMiniCartDetail = () => this.get(API_CART);

  removeProductItem = (productCode) => this.delete(`${API_ADD_TO_CART}/${productCode}`);

  updateCart = (shipmentId, productCode, quantity, requestFullData = true, recurringPlanID = '') =>
    this.put(API_CART_UPDATE, { shipmentId, code: productCode, quantity, requestFullData, recurringPlanID })
      .then((response) => Promise.resolve(response))
      .catch((err) => {
        simpleNotify.notify({
          level: 'danger',
          message: err.message,
        });
        return Promise.reject(err);
      });

  fetchShoppingCart = () => this.get(API_CART);

  removeProductItem = (productCode) => this.delete(`${API_CART}/${productCode}`, true);

  selectCustomerCare = (optKey, productCode) => this.post(API_PRODUCT_CUSTOMER_CARE, { key: optKey, code: productCode });

  unselectCustomerCare = (optKey, productCode) => this.delete(`${API_PRODUCT_CUSTOMER_CARE}/${productCode}?key=${optKey}`);

  selectProductDelivery = (optKey, productCode) => this.put(API_PRODUCT_DELIVERY, { code: productCode, key: optKey });

  selectDeliveryOption = (optValue) => this.post(API_DELIVERY, { key: optValue });

  submitShoppingCart = (data) => this.post(API_SUBMIT_SHOPPING_CART, data, true);

  getDeliveryMethods = (postcode) => this.get(`${API_CART_GET_DELIVERY}/?postCode=${postcode}`);

  applyPromotionCode = (data) => this.post(API_APPLY_PROMOTION_CODE, data);

  removePromotionCode = (data) => this.post(API_REMOVE_PROMOTION_CODE, data);

  fetchCartDetail = () => this.get(API_SPARE_PARTS_CART);

  addMultipleProduct = (products = []) => this.post(API_CART_ADD_MULTIPLE, { codes: products });

  addMultipleProductB2B = (products = []) => this.post(B2B_API_CART_ADD_MULTIPLE, { codes: products });

  b2bSaveCartAndGoToCheckout = (shipmentId, priorityId, lineItemList ) => this.post(B2B_API_SAVE_CART_AND_GO_TO_CHECKOUT, { shippingMethodId: shipmentId, priority: priorityId, lineItemList });
  
  requestForPriceEligibleOfPart = (partSku)=>this.get(`${API_PART_REQUEST_ELIGIBLE_PRICE}/?partNumber=${partSku}`);
}

export default new CartService();
