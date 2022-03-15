import simpleNotify from '../../scripts/ultis/simpleNotify';
import CartServices from '../../services/CartServices';
import MiniCart from '../MiniCart/MiniCart';

export const updateTotalItemBasketCart = (totalItem) => {
  const basket = document.querySelector('.js_top-nav__basket-count');
  if (basket) {
    basket.textContent = totalItem;
  }
};
class AddToCartButton {
  constructor(element) {
    this.selector = element;
    this.bindEventHanler(element);
  }

  handleOnClick = (e) => {
    const {
      target
    } = e;
    if (target.classList.contains('js_add-to-cart__button') || target.parentNode.classList.contains('js_add-to-cart__button')) {
      const addToCartBtnEl = target.classList.contains('js_add-to-cart__button') ? target : target.parentNode;
      addToCartBtnEl.disabled = true;
      const productID = addToCartBtnEl.getAttribute('data-skuCode');
      const amountNum = addToCartBtnEl.getAttribute('data-product-amount') || 1;
      const recurringPlanId = addToCartBtnEl.getAttribute('data-recurring-plan-id');

      if (addToCartBtnEl.classList.contains('js_request-price__button')) {
        CartServices.requestForPriceEligibleOfPart(productID)
          .then((data) => {

            let _level = 'danger';

            if (data.Success === true) {
              _level = 'good';
            }

            simpleNotify.notify({
              message: data.Message,
              level: _level,
              exContainerClassName: 'add-to-cart',
            });
          })
          .catch((err) => {
            console.log('err', err);
            simpleNotify.notify({
              message: err ? err.Message : 'Can not add to cart',
              level: 'danger',
              exContainerClassName: 'add-to-cart',
            });
          })
          .finally(() => {
            addToCartBtnEl.disabled = false;
          });
      } else {
        const minicart = new MiniCart(addToCartBtnEl, true);
        minicart.init(() =>
          CartServices.addSkuToCart(productID, amountNum, recurringPlanId)
          .then((data) => {
            updateTotalItemBasketCart(data.totalItems);
          })
          .catch((err) => {
            simpleNotify.notify({
              message: err ? err.Message : '',
              level: 'danger',
              exContainerClassName: 'add-to-cart',
            });
          })
          .finally(() => {
            addToCartBtnEl.disabled = false;
          }),
        );
      }
    }
  };

  bindEventHanler = (element) => {
    element.addEventListener('click', this.handleOnClick);
  };

  updateQuantity = (product, number) => {
    const addToCartBtns = [...this.selector.querySelectorAll('.js_add-to-cart__button')];
    const addToCartBtn = addToCartBtns.find((btn) => btn.dataset.skucode === product);
    if (addToCartBtn) {
      addToCartBtn.dataset.productAmount = number;
    }
  };

  updateRecurringPlanId = (product, recurringPlanId) => {
    const addToCartBtns = [...this.selector.querySelectorAll('.js_add-to-cart__button')];
    const addToCartBtn = addToCartBtns.find((btn) => btn.dataset.skucode === product);
    if (addToCartBtn) {
      addToCartBtn.dataset.recurringPlanId = recurringPlanId;
    }
  };
}
export default AddToCartButton;

export const addToCart = (selector) => new AddToCartButton(selector);