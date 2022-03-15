import LazyLoadImg from '../../../core/scripts/ultis/lazyloadImg';
// import productListPartTemp from './product-list-by-diagram-temp.pug';
// import { render as renderTemplate } from '../../scripts/render';
import { emptyDOM } from '../../../core/scripts/ultis/dom';
import AddToCartButton from '../../../core/components/AddToCartButton/AddToCart';
import { addToWishlist } from '../../../core/components/AddToWishlist/AddToWishlist';
import PartsByDiagramServices from './PartsByDiagramServices';
import { showLoading as showLoadingFunc } from '../../../core/scripts/components/LoadingIndicator';

export default class ProductListDiagram {
  stockAvaiable = null;

  props = {
    // recommended: {},
    bodyRequest: {},
  };

  loading = false;

  page = 1;

  constructor(selector, pageId) {
    this.selector = selector;
    this.productListSelector = this.selector.querySelector('.js_product-part-list');
    this.productListWrapperSelector = this.selector.querySelector('.js_product-part-list-wrapper');
    this.loadingMoreSelector = this.selector.querySelector('.js_product-part-list__loading-more');
    this.loadMoreButton = this.selector.querySelector('.js_product-part-list__load-more-button');
    this.loadMoreButton.addEventListener('click', this.handleLoadMore);
    this.bindEventAddToCart();
    addToWishlist(this.selector);
  }

  showLoading = () => {
    this.overlayLoadingEl = showLoadingFunc(true, this.productListWrapperSelector);
  };

  hideLoading = () => {
    this.overlayLoadingEl.remove();
  };

  render = (loadMore = false, products = []) => {
    if (!loadMore) {
      emptyDOM(this.productListSelector);
      this.page = 1;
    }

    // renderTemplate(productListPartTemp, { products }).appendTo(this.productListSelector);

    LazyLoadImg.DoObserver();
    this.renderLoadMoreButton();
  };

  renderLoadMoreButton = () => {
    const { hasMore } = this.props;
    if (hasMore) {
      this.loadMoreButton.classList.add('show');
    } else {
      this.loadMoreButton.classList.remove('show');
    }
  };

  handleLoadMore = () => {
    const { bodyRequest } = this.props;
    this.showLoadingMore();
    PartsByDiagramServices.fetchPartList({
      ...bodyRequest,
      Page: this.page + 1,
    })
      .then((res) => {
        this.props.hasMore = res.Paggination.HasMore;
        this.page = res.Paggination.CurrentPage;
        this.render(true, res.Products);
      })
      .finally(() => this.hideLoadingMore());
  };

  showLoadingMore = () => {
    this.loadingMoreSelector.classList.remove('hide');
    this.loadMoreButton.classList.remove('show');
  };

  hideLoadingMore = () => {
    this.loadingMoreSelector.classList.add('hide');
  };

  bindEventAddToCart = () => new AddToCartButton(this.productListSelector);
}
