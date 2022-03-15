import Vue from 'vue';
import template from './wishlist-detail-temp.pug';
import WishlistServices from '../../../../core/services/WishlistServices';
import lazyloadImg from '../../../../core/scripts/ultis/lazyloadImg';
import { popup } from '../../../../core/components/Popup/Popup';
import { selectBox } from '../../../../core/scripts/components/Selectbox';
import simpleNotify from '../../../../core/scripts/ultis/simpleNotify';
import Modal from '../../../../core/components/Modal/Modal';
import { route } from '../../../../core/scripts/ultis/route';
import { EMAIL_REGEX, EVENT_CLOSE_WISHLIST_MODAL_RECOMMENDED } from '../../../../core/scripts/constants';
import AddToCartButton, { updateTotalItemBasketCart } from '../../../../core/components/AddToCartButton/AddToCart';
import { addToWishlist } from '../../../../core/components/AddToWishlist/AddToWishlist';
import CartServices from '../../../../core/services/CartServices';
import HttpCancelError from '../../../../core/scripts/ultis/HttpCancelError';
import EventEmitter from '../../../../core/scripts/ultis/EventEmitter';
import { showFooter } from '../../../../core/scripts/ultis/dom';

export default class WishlistDetail {
  constructor(selector) {
    const el = document.createElement('div');
    this.wishlistId = selector.appendChild(el);
    const { wishlistId } = selector.dataset;
    this.vueInstance = this.createVueInstance(el, wishlistId, selector);
    addToWishlist(selector);
    this.recommendBlock = document.querySelector('.js_wishlist-recommend');
    this.vueInstance.recommend = this.recommendBlock;
    this.vueInstance.checkShowRecommend();
  }

  createVueInstance = (el, wishlistId, selector) =>
    new Vue({
      props: ['recommend'],
      el,
      template,
      data: () => ({
        loaded: false,
        loading: false,
        loadingName: false,
        editing: false,
        products: [],
        sortData: [],
        activeSort: null,
        sortValue: '',
        itemCountStr: '',
        wishlistUrl: '',
        wishlistName: '',
        deletedWishlist: {},
        optionalMessage: '',
        recipientEmail: '',
        senderName: '',
        submited: false,
        newWishlistName: '',
      }),

      created() {
        this.sortValue = route.getParam('sortBy');
        this.addtoCart = new AddToCartButton(selector);
        this.fetchData();
      },

      mounted() {
        EventEmitter.on(EVENT_CLOSE_WISHLIST_MODAL_RECOMMENDED, this.fetchData);
      },

      methods: {
        async fetchData() {
          let queryString = '';
          if (this.sortValue) {
            queryString = `sortBy=${this.sortValue}`;
          }
          this.loading = true;
          try {
            const { products, sortData, itemCountStr, wishlistUrl, displayName } = await WishlistServices.fetchById(wishlistId, queryString);
            this.products = products;
            this.sortData = sortData;
            this.itemCountStr = itemCountStr;
            this.wishlistUrl = wishlistUrl;
            this.wishlistName = displayName;
            this.newWishlistName = this.wishlistName;
            this.activeSort = this.sortData?.find((sortItem) => sortItem.name === this.sortValue);
            this.$nextTick(() => {
              this.createSelectBox();
              this.checkShowRecommend();
              lazyloadImg.DoObserver();
            });
          } catch (err) {
            console.log(err);
          }
          this.loading = false;
          this.loaded = true;
          showFooter();
        },

        isSortActive(name) {
          return this.sortValue === name;
        },

        createSelectBox() {
          popup(this.$refs.sortBySelectbox);
          selectBox(this.$refs.sortBySelectbox, { onChange: this.handleSelectSortBy });
        },

        async handleSubmitChangeWishlistName(event) {
          event.preventDefault();
          const { value } = this.$refs.wishlistNameInput;
          if (this.wishlistName === value.trim()) {
            this.editing = false;
            return;
          }
          if (this.loadingName) {
            return;
          }
          this.loadingName = true;
          try {
            await WishlistServices.updateWishlist(wishlistId, { name: value.trim() });
            this.wishlistName = value.trim();
            this.loadingName = false;
            this.editing = false;
          } catch (err) {
            if (err instanceof HttpCancelError) {
              return;
            }
            simpleNotify.notify({
              message: err?.message,
              level: 'danger',
            });
            this.loadingName = false;
            this.editing = false;
          }
          this.newWishlistName = this.wishlistName;
        },

        enableEditingName() {
          this.editing = true;

          this.$nextTick(() => this.$refs.wishlistNameInput.focus());
        },

        deleteWishlist(event) {
          event.preventDefault();
          if (!this.deleteModal) {
            this.deleteModal = new Modal(this.$refs.deleteWishlistBtn);
          }
          this.deletedWishlist = {
            displayName: this.wishlistName,
          };
          this.deleteModal.openModal();
        },

        async confirmDelete() {
          try {
            await WishlistServices.deleteById(wishlistId);
            window.location.href = this.wishlistUrl;
          } catch (err) {
            // console.log(err)
          }

          this.deleteModal.hideModal();
        },

        cancelDelete() {
          this.deleteModal.hideModal();
        },

        async addListToCart(event) {
          event.preventDefault();

          const products = this.products.map((product) => ({
            quantity: product.quantity ? product.quantity : 1,
            code: product.variantCode,
          }));

          try {
            const { message, cartPageLink, totalItems, successItems, failedItems } = await CartServices.addMultipleProduct(products);
            updateTotalItemBasketCart(totalItems);

            if (successItems.length > 0) {
              simpleNotify.notify({
                message: `${message} <a href='${cartPageLink}'>Go to cart</a>`,
                level: 'good',
                exContainerClassName: 'add-to-cart',
              });
            }

            if (failedItems.length > 0) {
              simpleNotify.notify({
                message: 'Some items are not available!',
                level: 'danger',
                exContainerClassName: 'add-to-cart',
              });
            }
          } catch (err) {
            simpleNotify.notify({
              message: err?.message,
              level: 'danger',
              exContainerClassName: 'add-to-cart',
            });
          }
        },

        async wait(time) {
          await setTimeout(() => {}, time);
        },

        handleSelectSortBy(value) {
          this.activeSort = this.sortData.find((sortItem) => sortItem.name === value);
          this.sortValue = value;
          window.history.replaceState({}, '', `?wl_id=${wishlistId}&sortBy=${value}`);
          this.fetchData();
        },

        showShareWishlistModal() {
          if (!this.shareWishlistModal) {
            this.shareWishlistModal = new Modal(this.$refs.shareWishlistBtn, () => {
              this.submited = false;
              this.resetForm();
            });
          }
          this.shareWishlistModal.openModal();
        },

        async handleSubmitShareWishlist(event) {
          event.preventDefault();
          this.submited = true;

          if (!this.validateShareWishlistForm()) {
            return;
          }
          try {
            const response = await WishlistServices.shareWishlist(wishlistId, {
              email: this.recipientEmail.trim(),
              id: wishlistId,
              message: this.optionalMessage.trim(),
              sender: this.senderName.trim(),
            });
            simpleNotify.notify({
              message: response?.message,
              level: 'good',
            });
          } catch (err) {
            simpleNotify.notify({
              message: err?.message,
              level: 'danger',
            });
          }

          this.shareWishlistModal.hideModal();
        },

        validateShareWishlistForm() {
          if (!this.recipientEmail.trim()) {
            return false;
          }

          if (!this.senderName.trim()) {
            return false;
          }

          if (this.recipientEmail && !EMAIL_REGEX.test(this.recipientEmail)) {
            return false;
          }
          return true;
        },

        addError(field, errorMessage) {
          this.error = {
            ...this.error,
            [field]: errorMessage,
          };
        },

        resetForm() {
          this.senderName = '';
          this.recipientEmail = '';
          this.optionalMessage = '';
        },

        isEmail(value) {
          return EMAIL_REGEX.test(value.trim());
        },

        decreaseProduct(product) {
          const quantity = product.quantity ? product.quantity - 1 : 1;
          this.updateProductQuantity(product, quantity || 1);
        },

        increaseProduct(product) {
          const quantity = product.quantity ? product.quantity + 1 : 2;
          this.updateProductQuantity(product, quantity);
        },

        updateProductQuantity(product, quantity) {
          const cloneProducts = [...this.products];
          const productIndex = cloneProducts.findIndex((item) => item.variantCode === product.variantCode);
          cloneProducts[productIndex] = {
            ...cloneProducts[productIndex],
            quantity,
          };
          this.products = cloneProducts;
          this.addtoCart.updateQuantity(product.variantCode, quantity);
        },

        async deleteProduct(product, event) {
          event.preventDefault();
          try {
            const { message } = await WishlistServices.removeProduct(wishlistId, product.code);
            this.itemCountStr = message;
            this.products = [...this.products.filter((productItem) => productItem.code !== product.code)];
            this.checkShowRecommend();
          } catch (err) {
            console.log(err);
          }
        },
        checkShowRecommend() {
          if (this.recommend) {
            if (this.products.length === 0) {
              this.recommend.classList.remove('hidden');
            } else {
              this.recommend.classList.add('hidden');
            }
          }
        },
      },
    });
}
