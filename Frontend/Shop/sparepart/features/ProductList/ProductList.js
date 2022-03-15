import Vue from 'vue';
import LazyLoadImg from '../../../core/scripts/ultis/lazyloadImg';
import AddToCartButton from '../../../core/components/AddToCartButton/AddToCart';
import { addToWishlist } from '../../../core/components/AddToWishlist/AddToWishlist';
import { showLoading as showLoadingFunc } from '../../../core/scripts/components/LoadingIndicator';
import { pagination } from '../../../core/components/Pagination/Pagination';
import template from './product-list-temp.pug';

export default class ProductList {
  stockAvailable = null;

  loading = false;

  productListVueInstance = null;

  submitChangePage = () => { };

  getProductListTemplate() {
    return template;
  }

  constructor(selector) {
    this.selector = selector;
    this.productListSelector = this.selector.querySelector('.js_product-list-container');
    this.productListWrapperSelector = this.selector.querySelector('.js_product-list-wrapper');
    this.loadingMoreSelector = this.selector.querySelector('.js_product-list__loading-more');
    this.paginationSelector = this.selector.querySelector('.js_pagination');
    this.productListContainerSelector = this.selector.querySelector('.js_product-list');
    this.bindEventAddToCart();
    addToWishlist(this.selector);
    const { currentPage, totalPage, hintText } = this.paginationSelector.dataset;
    this.pagination = pagination({ el: this.paginationSelector, currentPage, totalPage, hintText, onChange: this.handleOnChangePage });
  }

  showLoading = () => {
    this.overlayLoadingEl = showLoadingFunc(true, this.productListWrapperSelector);
  };

  hideLoading = () => {
    this.overlayLoadingEl.remove();
  };

  render = (products = [], signInUrl = '', isUnAuthenticated = false) => {
    if (!this.productListVueInstance) {
      this.productListVueInstance = new Vue({
        el: '.js_product-list',
        template: this.getProductListTemplate(),
        data() {
          return {
            products: [],
            signInUrl: '',
            promotionBoxDom: document.productListPromotionBoxDom || '',
            isUnAuthenticated: false,
          };
        },
      });
    }
    this.productListVueInstance.products = products;
    this.productListVueInstance.signInUrl = signInUrl;
    this.productListVueInstance.isUnAuthenticated = isUnAuthenticated;
    if (isUnAuthenticated) {
      this.productListVueInstance.signInUrl = `${signInUrl}${window.location.href}`;
    }
    if (products.length > 0) {
      this.pagination.show();
      setTimeout(() => {
        this.updateStockAvailable();
        LazyLoadImg.DoObserver();
      }, 0);
    } else {
      this.pagination.hide();
    }
  };

  renderPagination = (data) => {
    this.pagination.setHintText(data.ViewedItemMessage);
    this.pagination.setCurrentPage(data.CurrentPage);
    this.pagination.setTotalPage(data.TotalPage);
  };

  updateStockAvailable = () => {
    if (!this.stockAvailable || !this.stockAvailable.AvaibilityResult || !this.stockAvailable.AvaibilityResult.Avaibilities) {
      return;
    }
    const { Avaibilities } = this.stockAvailable.AvaibilityResult;
    const stockAvaiableEls = [...this.selector.querySelectorAll('.js_product-list__product-stock-avaiable')];
    Avaibilities.forEach((productAvaibility) => {
      const stockAvaiableEl = stockAvaiableEls.find((el) => el.dataset.productCode === productAvaibility.ProductCode);
      if (stockAvaiableEl) {
        stockAvaiableEl.classList.remove('hint');
        if (productAvaibility.AvaibilityAmount > 0) {
          stockAvaiableEl.innerText = `In Stock (${productAvaibility.AvaibilityAmount})`;
        } else {
          stockAvaiableEl.innerText = `Out of Stock ${productAvaibility.Eta && productAvaibility.Eta}`;
        }
      }
    });
  };

  bindEventAddToCart = () => new AddToCartButton(this.productListSelector);

  handleOnChangePage = (page) => {
    const header = document.body.querySelector('.js_header');
    const offsetTop = this.productListSelector.getBoundingClientRect().top + window.pageYOffset - 120 - header.clientHeight;
    document.body.scrollTop = offsetTop;
    document.documentElement.scrollTop = offsetTop;
    this.submitChangePage(page);
  };
}
