import Vue from 'vue';
import Modal from '../Modal/Modal';
import { selectBox } from '../../scripts/components/Selectbox';
import { emptyDOM } from '../../scripts/ultis/dom';
import template from './add-to-wishlist-modal-temp.pug';
import lazyloadImg from '../../scripts/ultis/lazyloadImg';
import WishlistServices from '../../services/WishlistServices';
import { popup } from '../Popup/Popup';

export default class AddToWishlist {
  formData = {
    wishlistId: null,
    wishlistName: null,
  };

  constructor(selector, callBackCloseModal) {
    this.selector = selector;
    this.isWishlistDetailPage = !!this.selector.dataset.wishlistId;
    this.selector.addEventListener('click', this.handleClick);
    this.callBackCloseModal = callBackCloseModal;
  }

  handleClick = ({ target }) => {
    const { parentNode } = target;
    this.addToWishlistBtnSelector = parentNode?.dataset?.addToWishlist !== undefined ? parentNode : target;
    if (this.addToWishlistBtnSelector.dataset.addToWishlist !== undefined) {
      var sapSsoAnchorTag = document.getElementById("SAP_SSO");
      if (sapSsoAnchorTag) {
        sapSsoAnchorTag.click();
        return;
      }

      const { productCode } = this.addToWishlistBtnSelector.dataset;
      this.modalInstance = new Modal(this.addToWishlistBtnSelector, this.callBackCloseModal);
      emptyDOM(this.modalInstance.getModalBodyEl());
      const el = document.createElement('div');
      this.modalInstance.getModalBodyEl().appendChild(el);
      this.modalInstance.openModal();
      this.vueInstance = this.createVueInstance(productCode, el, this.isWishlistDetailPage);
      this.vueInstance.$on('hideModal', () => {
        this.modalInstance.hideModal();
      });
    }
  };

  createVueInstance = (productCode, el, isWishlistDetailPage = false) =>
    new Vue({
      template,
      el,
      data: () => ({
        product: {},
        wishlist: [],
        selectedWishlist: null,
        wishlistName: '',
        submited: false,
        success: false,
        errorMessage: '',
        successMessage: '',
        myFavouritesLink: '',
        loading: false,
        isWishlistDetailPage,
      }),

      created() {
        // call api
        this.fetchData();
      },

      updated() {
        lazyloadImg.DoObserver();
      },

      methods: {
        async fetchData() {
          this.loading = true;
          try {
            const { product, wishlist, wishlistUrl, isAuthenticated } = await WishlistServices.fetchWishlist(`productCode=${productCode}`);
            if (!isAuthenticated) {
              window.location.href = wishlistUrl;
            }
            this.product = product;
            this.wishlist = wishlist;
            this.myFavouritesLink = wishlistUrl;
          } catch (err) {
            // error;
          }
          this.loading = false;
          this.$nextTick(this.createSelectBox);
        },

        createSelectBox() {
          if (this.$refs.wishlistSelectBox) {
            popup(this.$refs.wishlistSelectBox);
            selectBox(this.$refs.wishlistSelectBox, {
              onChange: this.handleOnSelectWishlist,
            });
          }
        },

        handleOnSelectWishlist(name) {
          this.errorSelectbox = true;
          this.selectedWishlist = name;
        },

        hideModal() {
          this.$emit('hideModal');
        },

        async handleSubmitForm(event) {
          event.preventDefault();
          this.submited = true;
          if (!this.selectedWishlist && !this.wishlistName.trim()) {
            return;
          }

          try {
            const { message } = await WishlistServices.addProduct({
              productCode,
              name: this.wishlistName || null,
              id: this.selectedWishlist || null,
            });
            this.success = true;
            this.successMessage = message;
          } catch (err) {
            this.success = false;
            this.errorMessage = err.message;
          }
        },

        redirect(url) {
          window.location.href = url;
        },
      },
    });
}

export const addToWishlist = (selector, callBackCloseModal = () => { }) => new AddToWishlist(selector, callBackCloseModal);
