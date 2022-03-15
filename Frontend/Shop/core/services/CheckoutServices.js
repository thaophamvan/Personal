import Http from '../scripts/ultis/Http';

class CheckoutServices extends Http {
  getPaymentMethod = (url, paymentMethodId) => this.get(`${url}/?paymentMethodId=${paymentMethodId}&v=${new Date().getTime()}`);
}

export default new CheckoutServices();
