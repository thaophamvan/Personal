import Vue from 'vue';
import Glide from '@glidejs/glide';
import AddToCartButton from '../AddToCartButton/AddToCart';
import { addToWishlist } from '../AddToWishlist/AddToWishlist';
import template from './you-may-also-like-temp.pug';
import ProductServices from '../../services/ProductServices';
import lazyloadImg from '../../scripts/ultis/lazyloadImg';
import { isMobileViewport } from '../../scripts/ultis/devices';
import EventEmitter from '../../scripts/ultis/EventEmitter';
import { EVENT_FETCH_RECOMMENDED_DATA, EVENT_CLOSE_WISHLIST_MODAL_RECOMMENDED } from '../../scripts/constants';

export default class YouMayAlsoLike {
  constructor(selector, vueTemplate = template) {
    this.selector = selector;
    this.partNumber = this.selector.dataset.partNumber;
    this.isWishlist = this.selector.dataset.isWishlist;
    this.bindEventAddToCart();
    addToWishlist(this.selector, this.closeWishlistModal);
    this.createVueInstance(vueTemplate);
  }

  createVueInstance = (template) => {
    this.vueInstance = new Vue({
      el: '.js_you-may-also-like__content',
      template,
      data: () => ({
        partNumber: this.partNumber,
        isWishlist: this.isWishlist,
        products: [],
        headerText: '',
        loading: false,
        originWidth: document.body.clientWidth,
      }),
      mounted() {
        this.fetchData();
        window.addEventListener('resize', this.handleResize);
        EventEmitter.on(EVENT_FETCH_RECOMMENDED_DATA, this.fetchData);
      },
      methods: {
        async fetchData() {
          this.loading = true;
          try {
            const response = await ProductServices.fetchRecommendedPart(this.partNumber, this.isWishlist);
            const { headerText, recommendations } = response;
            this.headerText = headerText;
            this.products = recommendations;

            this.$nextTick(() => {
              this.createSlider();
              lazyloadImg.DoObserver();
            });
          } catch (err) {
            this.products = [];
          }
          this.loading = false;
        },

        handleResize() {
          if (this.timeout) {
            clearTimeout(this.timeout);
          }

          this.timeout = setTimeout(() => {
            if (this.originWidth !== document.body.clientWidth) {
              this.originWidth = document.body.clientWidth;
              if (this.slider) {
                this.slider.destroy();
                this.slider = null;
              }
              this.createSlider();
            }
          }, 100);
        },

        createSlider() {
          if (!isMobileViewport() || this.products.length < 3) {
            if (this.slider) {
              this.slider.destroy();
              this.slider = null;
            }
            if (this.$refs.slider) {
              this.$refs.slider.classList.add('no-slider');
            }
            return;
          }

          this.$refs.slider.classList.remove('no-slider');
          this.slider = new Glide(this.$refs.slider, {
            startAt: 0,
            perView: 2,
            rewind: false,
            bound: true,
            gap: 10,
          });

          this.slider.mount();
        },
      },
    });
  };

  closeWishlistModal = () => {
    EventEmitter.emit(EVENT_CLOSE_WISHLIST_MODAL_RECOMMENDED);
  };

  bindEventAddToCart = () => new AddToCartButton(this.selector);
}
