import { addToWishlist } from '../../../core/components/AddToWishlist/AddToWishlist';
import AddToCartButton from '../../../core/components/AddToCartButton/AddToCart';
import { quantityControl } from '../../../core/components/QuantityControl/QuantityControl';

class ProductDetailInfo {
  constructor(selector) {
    this.component = selector;
    this.productCode = this.component.getAttribute('data-product-code');
    this.quantityControlSelector = this.component.querySelector('.js_qty-control');
    this.selectRecurring = this.component.querySelectorAll('.js_pdp-select-recurring');
    this.selectRecurringOption = this.component.querySelectorAll('.js_pdp-select-recurring__option');
    this.selectRecurringBtn = this.component.querySelector('.js_pdp-select-recurring__btn');
    this.recurringSavedPrice = this.component.querySelector('.js_pdp-saved-price');
    this.recurringPrice = this.component.querySelector('.js_pdp-recurring-price');
    quantityControl(this.quantityControlSelector, this.handleClickCounter);
    addToWishlist(this.component);
    this.bindEventAddToCart();
    this.bindEventRecurring();
  }

  bindEventAddToCart = () => {
    this.addtoCart = new AddToCartButton(this.component);
  };

  handleClickCounter = (product, quantity) => {
    this.addtoCart.updateQuantity(product, quantity);
  };

  updateRecurringPlanId = (item) => {
    this.addtoCart.updateRecurringPlanId(this.quantityControlSelector.getAttribute('data-product-code'), item ? item.getAttribute('data-recurring-plan-id') : '');
  };

  bindEventRecurring = () => {
    const ACTIVE_CLASS = 'is-active';
    if (this.selectRecurring.length === 0) {
      return;
    }
    [].forEach.call(this.selectRecurring, (item) => {
      item.addEventListener('click', (event) => {
        if (item.classList.contains(ACTIVE_CLASS)) {
          return;
        }
        this.component.querySelector(`.js_pdp-select-recurring.${ACTIVE_CLASS}`).classList.remove(ACTIVE_CLASS);
        item.classList.add(ACTIVE_CLASS);
        item.querySelector('input').checked = true;
        this.updateRecurringPlanId(item.querySelector('.js_pdp-select-recurring__btn'));
      });
    });
    [].forEach.call(this.selectRecurringOption, (item) => {
      item.addEventListener('click', () => {
        this.selectRecurringBtn.innerText = item.innerText;
        this.recurringSavedPrice.innerText = item.getAttribute('data-saved-price');
        this.recurringPrice.innerText = item.getAttribute('data-recurring-price');
        this.selectRecurringBtn.setAttribute('data-recurring-plan-id', item.getAttribute('data-recurring-plan-id'));
        this.updateRecurringPlanId(item);
      });
    });
  };
}
export default ProductDetailInfo;
