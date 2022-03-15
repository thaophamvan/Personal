import Vue from 'vue';
import template from './shopping-cart-temp.pug';
import CartServices from '../../../core/services/CartServices';
import lazyloadImg from '../../../core/scripts/ultis/lazyloadImg';
import simpleNotify from '../../../core/scripts/ultis/simpleNotify';
import { updateTotalItemBasketCart } from '../../../core/components/AddToCartButton/AddToCart';
import { addToWishlist } from '../../../core/components/AddToWishlist/AddToWishlist';
import { route } from '../../../core/scripts/ultis/route';
import EventEmitter from '../../../core/scripts/ultis/EventEmitter';
import { EVENT_FETCH_RECOMMENDED_DATA } from '../../../core/scripts/constants';
import { showFooter } from '../../../core/scripts/ultis/dom';

export default class ShoppingCart {
  getTemplate() {
    return template;
  }
  constructor(selector) {
    this.selector = selector;
    addToWishlist(this.selector);
    this.vueInstance = new Vue({
      el: '.js_shopping-cart-content',
      template: this.getTemplate(),
      data: () => ({
        isMobile: window.innerWidth < 992,
        products: [],
        isActiveRecurring: false,
        shippingMethods: [],
        totalDisplay: null,
        subTotalDisplay: null,
        discountAmountDisplay: null,
        checkoutPage: '',
        shippingTotalDisplay: '',
        discountAmount: 0,
        loadedPage: false,
        loadingPage: false,
        messages: [],
        promotionCode: '',
        applyingPromotionCode: false,
        isAuthenticated: false,
        loadingData: false,
        appliedPromotionMessage: '',
        errorProducts: route
          .getParam('errors')
          ?.split(',')
          .map((item) => `[${item}]`)
          .join(', '),
        signInUrl: '',
        isUnAuthenticated: false,

      }),

      created() {
        this.fetchData();
        document.addEventListener('click', (event) => {
          var { target } = event;
          if(target.classList.contains('js_pdp-select-recurring__btn')) {
            return;
          }
          this.closeAllPopup();
        })
      },

      methods: {
        async fetchData() {
          this.loadingPage = true;
          try {
            const response = await CartServices.fetchCartDetail();
            this.setData(response);
          } catch (err) {
            console.log(err);
          }

          this.loadedPage = true;
          this.loadingPage = false;
          showFooter();
        },

        setData(response) {
          const { products, isActiveRecurring, itemCount, shippingMethods, totalDisplay, subTotalDisplay, discountAmountDisplay, checkoutPage, shippingTotalDisplay, discountAmount, isAuthenticated, helpMessage, promotionMessages, appliedPromotionMessage, errorMessage, signInUrl } = response;
          this.isActiveRecurring = isActiveRecurring;
          this.products = [...products];
          this.shippingMethods = shippingMethods;
          this.totalDisplay = totalDisplay;
          this.subTotalDisplay = subTotalDisplay;
          this.discountAmountDisplay = discountAmountDisplay;
          this.checkoutPage = checkoutPage;
          this.shippingTotalDisplay = shippingTotalDisplay;
          this.discountAmount = discountAmount;
          this.isAuthenticated = isAuthenticated;
          this.helpMessage = helpMessage;
          this.promotionMessages = promotionMessages;
          this.appliedPromotionMessage = appliedPromotionMessage;
          if (!isAuthenticated) {
            this.signInUrl = `${signInUrl}${window.location.href}`;
          }
          else {
            this.signInUrl = signInUrl;
          }
          this.errorMessage = errorMessage;
          this.isUnAuthenticated = !isAuthenticated;
          if (this.appliedPromotionMessage) {
            simpleNotify.notify({
              message: this.appliedPromotionMessage,
              level: 'good',
            });
          }
          updateTotalItemBasketCart(itemCount);
          setTimeout(() => lazyloadImg.DoObserver(), 0);
        },

        async increaseProduct(product) {
          this.loadingData = true;
          try {
            const response = await CartServices.updateCart(product.shipmentId, product.code, product.quantity + 1, false, product.activeRecurringPlan ? product.activeRecurringPlan.recurringPlanID : '');
            this.setData(response);
          } catch (err) {
            // handle error;
          }
          this.loadingData = false;
        },

        async decreaseProduct(product) {
          if (product.quantity === 1) {
            return;
          }
          this.loadingData = true;
          try {
            const response = await CartServices.updateCart(product.shipmentId, product.code, product.quantity - 1, false, product.activeRecurringPlan ? product.activeRecurringPlan.recurringPlanID : '');
            this.setData(response);
          } catch (err) {
            // handle error;
          }
          this.loadingData = false;
        },

        async removeProduct(product) {
          this.loadingData = true;
          const response = await CartServices.updateCart(product.shipmentId, product.code, 0, false);
          this.setData(response);
          if (this.products.length === 0) {
            EventEmitter.emit(EVENT_FETCH_RECOMMENDED_DATA);
          }
          this.loadingData = false;
        },

        async handleSubmitPromotionalCode(event) {
          event.preventDefault();
          if (!this.promotionCode.trim()) {
            return;
          }
          this.applyingPromotionCode = true;
          try {
            const response = await CartServices.applyPromotionCode({ code: this.promotionCode });
            this.setData(response);
          } catch (err) {
            simpleNotify.notify({
              message: err?.message,
              level: 'danger',
            });
          }
          this.applyingPromotionCode = false;
        },

        removeError() {
          this.errorProducts = '';
          window.history.replaceState({}, '', window.location.href.split('?')[0]);
        },

        redirect(path) {
          window.location.href = path;
        },

        closeAllPopup() {
          let recurringPopupElements = document.querySelectorAll('.js_recurring-popup');
          [].forEach.call(recurringPopupElements, item => {
            item.classList.remove('is-active');
            item.querySelector('.popup').classList.remove('show');
          })
        },

        showPopup(event) {
          var {currentTarget} = event;
          this.closeAllPopup();
          currentTarget.classList.add('is-active');
          currentTarget.querySelector('.popup').classList.add('show');
        },

        async onChangeRecurring(product, recurring) {
          this.closeAllPopup();
          this.loadingData = true;
          try {
            const response = await CartServices.updateCart(product.shipmentId, product.code, product.quantity, false, recurring.recurringPlanID);
            this.setData(response);
          } catch (err) {
            // handle error;
          }
          this.loadingData = false;
        }
      },
    });
  }
}
