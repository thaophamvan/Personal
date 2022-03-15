import MinicarHtml from './_mini_cart.pug';
import { render } from '../../scripts/ultis/render';
import MiniCartItemHtml from './_mini_cart_item.pug';
import MiniCartBonusItemHtml from './minicart-bonus-item.pug';
import QuantityControl from './QuantityControl';
import Modal from '../Modal/Modal';
import miniCartHeaderHtml from './mini-cart-header.pug';
import { showLoading } from '../../scripts/components/LoadingIndicator';
import CartServices from '../../services/CartServices';
import lazyloadImg from '../../scripts/ultis/lazyloadImg';

export default class MiniCart {
  constructor(element, isAddToCart) {
    this.selector = element;
    this.isAddToCart = isAddToCart;
    this.modal = this.getTarget();
    this.miniCart = this.modal.querySelector('.js_mini-cart-popup');

    if (!isAddToCart) {
      this.getCartQuantity();
      this.bindEventHanlder();
    }
  }

  getTarget = () => {
    const { dataset } = this.selector;
    return document.getElementById(dataset.modal);
  };

  getCartQuantity = () => {
    CartServices.getCartQuantity().then((cartCount) => {
      this.selector.querySelector('.js_top-nav__basket-count').textContent = cartCount;
    });
  };

  bindEventHanlder = () => {
    const self = this;
    this.selector.addEventListener('click', () => {
      const basket = document.querySelector('.js_top-nav__basket-count');
      if (+basket.innerText === 0) {
        window.location.href = this.selector.dataset.cartPageUrl;
        return;
      }
      showLoading(false, this.miniCart);
      const miniCartPopup = new Modal(this.selector, this.onClosePopup, true);
      miniCartPopup.openModal();
      CartServices.getMiniCartDetail(this.miniCart).then((data) => {
        if (data.products && data.products.length <= 0) {
          miniCartPopup.forceHideModal();
          window.location.href = data.cartPage;
        } else {
          self.getMiniCartInfor(data);
          miniCartPopup.rebindEvent();
        }
        // this.miniCart.classList.remove('loading');
      });
    });
  };

  init = async (addToCartCallBack = async () => {}) => {
    showLoading(false, this.miniCart);
    const miniCartPopup = new Modal(this.selector, this.onClosePopup);
    miniCartPopup.openModal();
    if (this.isAddToCart) {
      await addToCartCallBack();
    }
    CartServices.getMiniCartDetail(this.miniCart).then((data) => {
      this.getMiniCartInfor(data);
      miniCartPopup.rebindEvent();
      // this.miniCart.classList.remove('loading');
    });
  };

  getMiniCartInfor = (data) => {
    let itemShow = data.products.length;
    if (!itemShow) itemShow = 0;
    if (itemShow >= 3) {
      itemShow = 3;
    }
    this.renderMiniCartNode(itemShow, data.products.length, data.maxItemsPerCart, data.subTotalDisplay, data.currencyPrefix, data.currencySuffix, data.products, data.cartPage, data.shippingInformation);
  };

  updateMiniCartInfor = (data) => {
    let itemShow = data.products.length;
    if (!itemShow) itemShow = 0;
    if (itemShow >= 3) {
      itemShow = 3;
    }
    const mincartHeaderEl = this.miniCart.querySelector('.js_minicart__header');
    mincartHeaderEl.innerHTML = '';
    mincartHeaderEl.innerHTML = render(miniCartHeaderHtml, {
      itemShow,
      itemCount: data.products.length,
      maxItemsPerCart: data.maxItemsPerCart,
      cartPage: data.cartPage,
    });
    this.renderSubTotal(data.subTotalDisplay);
    const miniCartBodyEl = this.miniCart.querySelector('.js_mini-cart__body');
    const productListEl = miniCartBodyEl.querySelector('.js_mini-cart__product-list');
    productListEl.innerHTML = '';
    this.renderMiniCartProductItem(productListEl, data.products, data.currencyPrefix, data.currencySuffix);
    this.updateTotalItemBasketCart(data.itemCount);
  };

  renderMiniCartNode = (itemShow, itemCount, maxItemsPerCart, subtotal, currencyPrefix, currencySuffix, products, cartPage, shippingInformation) => {
    const miniCartData = {
      subtotal,
      currencyPrefix,
      currencySuffix,
      maxItemsPerCart,
      itemCount,
      itemShow,
      cartPage,
      shippingInformation,
    };
    this.miniCart.innerHTML = render(MinicarHtml, miniCartData);
    this.renderSubTotal(subtotal);
    const miniCartBody = this.miniCart.querySelector('.js_mini-cart__product-list');
    this.renderMiniCartProductItem(miniCartBody, products, currencyPrefix, currencySuffix);
    const deliveryInform = this.miniCart.querySelector('.js_minicart__delivery');
    if (shippingInformation) {
      deliveryInform.classList.remove('d-none');
    }
  };

  renderMiniCartProductItem = (body, products, currencyPrefix, currencySuffix) => {
    for (let i = products.length - 1; i >= 0; i--) {
      const el = document.createElement('div');
      if (products[i].isGift) {
        el.innerHTML = render(MiniCartBonusItemHtml, {
          ...products[i],
          img: products[i].img || '',
          discountedPriceDisplay: `${products[i].discountedPriceDisplay}`,
          subTotalDisplay: `${products[i].subTotal ? `${products[i].subTotalDisplay}` : ''}`,
        });
      } else {
        el.innerHTML = render(MiniCartItemHtml, {
          ...products[i],
          img: products[i].img || '',
          discountedPriceDisplay: `${products[i].discountedPrice ? `${products[i].discountedPriceDisplay}` : ''}`,
          subTotalDisplay: `${products[i].subTotal ? `${products[i].subTotalDisplay}` : ''}`,
          activeRecurringPlanId: products[i].activeRecurringPlan ? products[i].activeRecurringPlan.recurringPlanID : '',
        });
      }
      
      if (products[i].isDiscounted) {
        el.children[0].classList.add('minicart--discount');
      }
      // eslint-disable-next-line no-new
      new QuantityControl(el.querySelector('.js_quantity-control'), this.updateMiniCartInfor);
      body.appendChild(el.children[0]);
      if (i === products.length - 3) break;
    }
    lazyloadImg.DoObserver();
    this.bindRemoveHandler(body);
  };

  bindRemoveHandler = (parentNode) => {
    parentNode.removeEventListener('click', this.removeHandler);

    parentNode.addEventListener('click', this.removeHandler);
  };

  removeHandler=(e) => {
    if (e.target && e.target.matches('button.js_mini-cart__product-item-remove')) {
      this.removeProduct(e.target.closest('.js_mini-cart__product-item'));
      e.stopPropagation();
    }
  };

  removeProduct = (e) => {
    const overlayEl = showLoading(false, e);
    overlayEl.classList.add('overlay-loading');
    const productCode = e.querySelector('[data-product-code]').getAttribute('data-product-code');
    const shipmentId = e.getAttribute('data-shipmentid');
    CartServices.updateCart(shipmentId, productCode, 0)
      .then((data) => {
        this.updateMiniCartInfor(data);
        this.updateTotalItemBasketCart(data.itemCount);
        overlayEl.remove();
      })
      .catch(() => overlayEl.remove());
  };

  renderSubTotal = (subtotal) => {
    const subtotalSpan = this.miniCart.querySelector('.js_mini-cart__total');
    subtotalSpan.innerText = `${subtotal}`;
  };

  onClosePopup = () => {
    this.miniCart.innerHTML = '';
  };

  updateTotalItemBasketCart = (totalItems) => {
    const basket = document.getElementsByClassName('js_top-nav__basket-count');
    basket[0].textContent = totalItems;
  };
}
