import Http from '../scripts/ultis/Http';
import {
  API_ADDRESS_BILLING,
  API_ACCOUNT_STATE,
  API_ORDER,
  API_ADDRESS_DELIVERY,
  API_CART_REORDER,
  API_RECURRING_ORDER_DETAIL,
} from '../scripts/constants';

class MyAccountService extends Http {
  getDeliveryAddress = (rowId) => this.get(`${API_ADDRESS_DELIVERY}/${rowId}`);

  addNewDeliveryAddress = (data) => this.post(API_ADDRESS_DELIVERY, data);

  editDeliveryAddress = (data) => this.put(API_ADDRESS_DELIVERY, data);

  deleteDeliveryAddress = (rowId, userId) => this.delete(`${API_ADDRESS_DELIVERY}/${rowId}`);

  getBillingAddress = (rowId) => this.get(`${API_ADDRESS_BILLING}/${rowId}`);

  addNewBillingAddress = (data) => this.post(API_ADDRESS_BILLING, data);

  editBillingAddress = (data) => this.put(API_ADDRESS_BILLING, data);

  deleteBillingAddress = (rowId) => this.delete(`${API_ADDRESS_BILLING}/${rowId}`);

  getAddressState = () => this.get(API_ACCOUNT_STATE);

  getOrderDetail = (orderNumber) => this.get(`${API_ORDER}/${orderNumber}`);

  getRecurringPlanDetail = (cartName) => this.get(`${API_RECURRING_ORDER_DETAIL}/${cartName}`);

  postReOrder = (orderNumber) => this.post(`${API_CART_REORDER}/${orderNumber}`);
}
export default new MyAccountService();
