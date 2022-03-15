import { getClosest } from '../../scripts/ultis/dom';
import simpleNotify from '../../scripts/ultis/simpleNotify';

class QuantityControl {
  constructor(element, callbackUpdatePrice, closestSelectorTag) {
    this.selector = element;
    this.callBackUpdatePrice = callbackUpdatePrice;
    this.product = this.selector.getAttribute('data-product-code');
    this.els = {
      decrement: this.selector.querySelector('.js_qty-control__decrease'),
      increment: this.selector.querySelector('.js_qty-control__increase'),
      input: this.selector.querySelector('input'),
    };
    this.counter = Number(this.els.input.value);
    this.bindEventHandler();
    this.callBack = callbackUpdatePrice;
    this.closestSelectorTag = closestSelectorTag;

    this.setupInput();
  }

  bindEventHandler = () => {
    this.els.decrement && this.els.decrement.addEventListener('click', this.decrementEvent);
    this.els.increment && this.els.increment.addEventListener('click', this.incrementEvent);
    this.els.input.addEventListener('input', this.onChangeEvent);
    this.els.input.addEventListener('change', this.onChangeEvent);
  };

  incrementEvent = () => {
    this.counter = Number(this.els.input.value);
    this.counter = this.counter + 1;
    this.doUpdateInfor();
  };

  decrementEvent = () => {
    this.counter = Number(this.els.input.value);
    if (this.counter > 1) {
      this.counter = this.counter - 1;
      this.doUpdateInfor();
    }
  };

  onChangeEvent = () => {
    if (!this.els.input.checkValidity()) {
      simpleNotify.notify({
        message: this.els.input.validationMessage,
        level: 'danger',
      });

      this.els.input.value = this.counter;
      return;
    }

    this.counter = Number(this.els.input.value);
    this.doUpdateInfor();
  }

  doUpdateInfor = () => {
    let closestSelector = {};
    if (this.closestSelectorTag) {
      closestSelector = getClosest(this.selector, this.closestSelectorTag);
      this.shipmentId = closestSelector.getAttribute('data-shipmentId');
    }

    this.renderInput();
    this.callBack(this.product, this.counter);
  };

  renderInput = () => {
    this.els.input.value = this.counter;
  };

  setupInput = () => {
    this.els.input.setAttribute('type', 'number');
    this.els.input.setAttribute('min', '1');
  }
}

export default QuantityControl;

export const quantityControl = (selector, cb = () => { }, tagselector) => new QuantityControl(selector, cb, tagselector);
