import { debounce } from '../../scripts/ultis/obj';
import { showLoading, hideLoading } from '../../scripts/components/LoadingIndicator';
import CartServices from '../../services/CartServices';

class QuantityControl {
  constructor(element, callbackUpdatePrice) {
    this.seletor = element;
    this.callBackUpdatePrice = callbackUpdatePrice;
    this.product = this.seletor.getAttribute('data-product-code');
    this.shipmentId = this.seletor.getAttribute('data-shipmentid');
    this.activeRecurringPlanId = this.seletor.getAttribute('data-activerecurringplanid');
    this.els = {
      decrement: this.seletor.querySelector('.js_qty-control__decrement'),
      increment: this.seletor.querySelector('.js_qty-control__increment'),
      input: this.seletor.querySelector('input'),
    };
    this.counter = Number(this.els.input.value);
    this.bindEventHandler();
  }

  bindEventHandler = () => {
    this.els.decrement.addEventListener('click', debounce(this.doDecrementEvent, 100));
    this.els.increment.addEventListener('click', debounce(this.doIncrement, 100));
  };

  doIncrement = () => {
    this.counter = Number(this.els.input.value);
    this.counter = this.counter + 1;
    const elWrapper = this.els.increment.closest('.js_mini-cart__product-item');
    showLoading(true, elWrapper);
    this.callUpdateQuantity();
  };

  callUpdateQuantity = () => {
    CartServices.updateCart(this.shipmentId, this.product, this.counter, null, this.activeRecurringPlanId)
      .then((data) => {
        this.callBackUpdatePrice(data);
      })
      .catch((err) => {
        // handle error
      })
      .finally(() => {
        hideLoading('.js_loading__overlay');
      });
  };

  doDecrementEvent = () => {
    this.counter = Number(this.els.input.value);
    if (this.counter > 1) {
      const elWrapper = this.els.increment.closest('.js_mini-cart__product-item');
      showLoading(true, elWrapper);
      this.counter = this.counter - 1;
      this.callUpdateQuantity();
    }
  };

  renderInput = () => {
    this.els.input.value = this.counter;
  };
}

export default QuantityControl;
