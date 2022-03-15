import Vue from 'vue';
import template from './wishlist-temp.pug';
import WishlistServices from '../../../../core/services/WishlistServices';
import { popup } from '../../../../core/components/Popup/Popup';
import { selectBox } from '../../../../core/scripts/components/Selectbox';
import Modal from '../../../../core/components/Modal/Modal';
import lazyloadImg from '../../../../core/scripts/ultis/lazyloadImg';
import simpleNotify from '../../../../core/scripts/ultis/simpleNotify';
import { route } from '../../../../core/scripts/ultis/route';
import HttpCancelError from '../../../../core/scripts/ultis/HttpCancelError';
import EventEmitter from '../../../../core/scripts/ultis/EventEmitter';
import { showFooter } from '../../../../core/scripts/ultis/dom';

import { EVENT_CLOSE_WISHLIST_MODAL_RECOMMENDED } from '../../../../core/scripts/constants';

export default class Wishlist {
  constructor(selector) {
    this.selector = selector;
    this.vueInstance = this.createVueInstance();
    this.recommendBlock = document.querySelector('.js_wishlist-recommend');
    this.vueInstance.recommend = this.recommendBlock;
  }

  createVueInstance = () => {
    const el = document.createElement('div');
    this.selector.appendChild(el);
    return new Vue({
      props: ['recommend'],
      el,
      template,
      data: () => ({
        wishlist: [],
        loading: false,
        loaded: false,
        isAuthenticated: false,
        editing: {},
        deletedWishlist: {},
        createNewModal: null,
        wishlistName: '',
        sortData: [],
        activeSort: {},
        sortValue: '',
        loadingName: {},
        errorMessage: '',
        submited: false,
        listNameModel: {},
      }),

      created() {
        const sortValue = route.getParam('sortBy');
        this.sortValue = sortValue;
        this.fetchData();
      },

      mounted() {
        EventEmitter.on(EVENT_CLOSE_WISHLIST_MODAL_RECOMMENDED, this.fetchData);
      },

      methods: {
        async fetchData(cb = () => {}) {
          this.loading = true;
          try {
            const response = await WishlistServices.fetchWishlist(`${this.sortValue ? `sortBy=${this.sortValue}` : ''}`);
            this.setData(response);
            this.loading = false;
            this.$nextTick(() => {
              this.createSelectBox();
              this.checkShowRecommend();
              lazyloadImg.DoObserver();
            });
          } catch (err) {
            if (err instanceof HttpCancelError) {
              return;
            }
            this.loading = false;
          }
          this.loaded = true;
          showFooter();
        },

        setData(response) {
          const { wishlist, isAuthenticated, registerUrl, signInUrl, sortData } = response;
          this.wishlist = wishlist;
          this.isAuthenticated = isAuthenticated;
          this.registerUrl = registerUrl;
          this.signInUrl = signInUrl;
          this.sortData = sortData;
          this.activeSort = this.sortData.find((sortItem) => sortItem.name === this.sortValue) || {};
          this.mapListNameModel();
        },

        redirect(url) {
          window.location.href = url;
        },

        mapListNameModel() {
          this.wishlist.forEach((item) => {
            this.listNameModel[item.id] = item.displayName;
          });
        },

        createSelectBox() {
          if (this.$refs.sortBySelectbox && !this.selectBox) {
            popup(this.$refs.sortBySelectbox);
            this.selectBox = selectBox(this.$refs.sortBySelectbox, { onChange: this.handleSelectSortBy });
          }
        },

        handleSelectSortBy(value) {
          window.history.replaceState({}, '', `?sortBy=${value}`);
          this.activeSort = this.sortData.find((sortItem) => sortItem.name === value);
          this.sortValue = value;
          this.fetchData();
        },

        showCreateNewModal() {
          if (!this.createNewModal) {
            this.createNewModal = new Modal(this.$refs.createNewBtn, () => {
              this.wishlistName = '';
              this.submited = false;
            });
          }
          this.createNewModal.openModal();
        },

        editWishlistName(wishlistItem, event) {
          event.preventDefault();
          this.editing = {
            ...this.editing,
            [wishlistItem.id]: true,
          };
          this.$nextTick(() => {
            this.$refs[`wishlist-${wishlistItem.id}`][0].focus();
          });
        },

        async handleSubmitChangeWishlistName(wishlistItem) {
          const value = this.$refs[`wishlist-${wishlistItem.id}`][0].value.trim();
          if (wishlistItem.displayName === value) {
            this.editing = {
              ...this.editing,
              [wishlistItem.id]: false,
            };
            return;
          }

          if (this.loadingName[wishlistItem.id]) {
            return;
          }
          this.loadingName = {
            ...this.loadingName,
            [wishlistItem.id]: true,
          };
          try {
            await WishlistServices.updateWishlist(wishlistItem.id, { name: value });
            const cloneWishlist = [...this.wishlist];
            const wishlistItemIndex = cloneWishlist.findIndex((item) => item.id === wishlistItem.id);
            cloneWishlist[wishlistItemIndex] = { ...wishlistItem, displayName: value };
            this.wishlist = cloneWishlist;
            this.listNameModel = {
              ...this.listNameModel,
              [wishlistItem.id]: value,
            };
            this.loadingName = {
              ...this.loadingName,
              [wishlistItem.id]: false,
            };
            this.editing = {
              ...this.editing,
              [wishlistItem.id]: false,
            };
          } catch (err) {
            if (err instanceof HttpCancelError) {
              return;
            }
            this.loadingName = {
              ...this.loadingName,
              [wishlistItem.id]: false,
            };
            this.listNameModel = {
              ...this.listNameModel,
              [wishlistItem.id]: wishlistItem.displayName,
            };
            this.editing = {
              ...this.editing,
              [wishlistItem.id]: false,
            };
            simpleNotify.notify({
              message: err.message,
              level: 'danger',
            });
          }
        },

        deleteWishlist(wishlistItem, event) {
          event.preventDefault();
          this.deletedWishlist = wishlistItem;
          if (!this.deleteModal) {
            this.deleteModal = new Modal(event.target);
          }
          this.deleteModal.openModal();
        },

        async confirmDelete() {
          this.loading = true;
          try {
            await WishlistServices.deleteById(this.deletedWishlist.id);
            this.fetchData();
          } catch (err) {
            console.log(err);
          }
          this.loading = false;
          this.deleteModal.hideModal();
          this.checkShowRecommend();
        },

        cancelDelete() {
          this.deletedWishlist = {};
          this.deleteModal.hideModal();
        },

        closeCreateNewModal() {
          this.createNewModal.hideModal();
        },

        isSortActive(name) {
          return this.sortValue === name;
        },

        async handleCreateNewWishlist(event) {
          event.preventDefault();
          if (!this.wishlistName.trim()) {
            return;
          }
          this.submited = true;
          this.loading = true;
          try {
            await WishlistServices.create({ name: this.wishlistName.trim() });
            this.createNewModal.hideModal();
            this.fetchData();
          } catch (err) {
            this.errorMessage = err.message;
          }
          this.loading = false;
        },

        displayProduct(products = []) {
          const displayedProducts = [...products.slice(0, 4)];
          displayedProducts.length = 4;
          return displayedProducts;
        },

        hasMoreProduct(wishlistItem) {
          const numberMoreProduct = wishlistItem.itemCount - 4;
          if (numberMoreProduct > 0) {
            return {
              numberMoreProduct,
            };
          }

          return false;
        },
        checkShowRecommend() {
          if (this.recommend) {
            if (this.wishlist.length === 0) {
              this.recommend.classList.remove('hidden');
            } else {
              this.recommend.classList.add('hidden');
            }
          }
        },
      },
    });
  };
}
