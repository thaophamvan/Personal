const components = {
  toggler: () => import(/* webpackChunkName: "common" */ '../../../core/scripts/components/toggler'),
  propagationStopper: () => import(/* webpackChunkName: "common" */ '../../../core/scripts/components/propagation-stopper'),
  popup: () => import(/* webpackChunkName: "common" */ '../../../core/components/Popup/Popup'),
  minicart: () => import(/* webpackChunkName: "common" */ '../../../core/components/MiniCart/MiniCart'),
  categoryListSlider: () => import(/* webpackChunkName: "common" */ '../../../core/components/CategoryList/CategoryList'),
  mainNavigation: () => import(/* webpackChunkName: "common" */ '../../features/MainNavigation/MainNavigation'),
  shoppingCart: () => import(/* webpackChunkName: "common" */ '../../features/ShoppingCart/ShoppingCart'),
  generalSearchResult: () => import(/* webpackChunkName: "common" */ '../../features/GeneralSearchResult/GeneralSearchResult'),
  modal: () => import(/* webpackChunkName: "common" */ '../../../core/components/Modal/Modal'),
  maintenanceModal: () => import(/* webpackChunkName: "common" */ '../../../core/components/MaintenanceModal/MaintenanceModal'),
  rightNavigation: () => import(/* webpackChunkName: "common" */ '../../features/RightNavigation/RightNavigation'),
  playVideoButton: () => import(/* webpackChunkName: "common" */ '../../../core/components/PlayVideoButton/PlayVideoButton'),
  promotionalBanner: () => import(/* webpackChunkName: "common" */ '../../../core/components/PromotionalBanner/PromotionalBanner'),
  heroBannerSearch: () => import(/* webpackChunkName: "common" */ '../../features/HeroBannerSearch/HeroBannerSearch'),
  partsByDiagram: () => import(/* webpackChunkName: "common" */ '../../features/PartsByDiagram/PartsByDiagram'),
  heroBannerSlider: () => import(/* webpackChunkName: "common" */ '../../../core/components/HeroBanner/HeroBannerSlider'),
  youMayAlsoLike: () => import(/* webpackChunkName: "common" */ '../../../core/components/YouMayAlsoLike/YouMayAlsoLike'),
  productDetailInfo: () => import(/* webpackChunkName: "product-detail" */ '../../features/ProductDetailInfo/ProductDetailInfo'),
  productDetailSlider: () => import(/* webpackChunkName: "product-detail" */ '../../../core/components/ProductDetailSlider/ProductDetailSlider'),
  productDetailSpecification: () => import(/* webpackChunkName: "product-detail" */ '../../features/ProductDetailSpecification/ProductDetailSpecification'),
  productDetailCompatibility: () => import(/* webpackChunkName: "product-detail" */ '../../features/ProductDetailCompatibility/ProductDetailCompatibility'),
  wishlist: () => import(/* webpackChunkName: "wishlist" */ '../../features/Wishlist/ListingPage/Wishlist'),
  wishlistDetail: () => import(/* webpackChunkName: "wishlist-detail" */ '../../features/Wishlist/WishlistDetailPage/WishlistDetail'),
  checkout: () => import(/* webpackChunkName: "checkout" */ '../../features/Checkout/Checkout'),
  getInTouch: () => import(/* webpackChunkName: "get-in-touch" */ '../../features/GetInTouch/GetInTouch'),
  category: () => import(/* webpackChunkName: "category" */ '../../features/Category/Category'),
  partCategory: () => import(/* webpackChunkName: "part-category" */ '../../features/PartCategoryPage/PartCategory'),
  pncListing: () => import(/* webpackChunkName: "pnc-listing" */ '../../features/PNCListing/PncListing'),
  searchResult: () => import(/* webpackChunkName: "search-result" */ '../../../core/components/SearchResult/SearchResult'),
  productResultModel: () => import(/* webpackChunkName: "product-result-model" */ '../../features/ProductResultModel/ProductResultModel'),
  faqsPage: () => import(/* webpackChunkName: "faqs" */ '../../features/FAQsPage/FAQs'),
  myAccount: () => import(/* webpackChunkName: "my-account" */ '../../../core/components/MyAccount/MyAccount'),
  searchSparePartBanner: () => import(/* webpackChunkName: "common" */ '../../features/SearchSparePartBanner/SearchSparePartBanner'),
  newsletterSubscriber: () => import(/* webpackChunkName: "common" */ '../../features/Footer/newsletter-subscriber-block'),
  compatiblePart: () => import(/* webpackChunkName: "common" */ '../../features/CompatiblePart/CompatiblePart'),
  recurringDetail: () => import(/* webpackChunkName: "common" */ '../../../core/components/RecurringDetail/RecurringDetail'),
};

class ComponentLoader {
  // eslint-disable-next-line class-methods-use-this
  loadComponents(element) {
    const dataComponents = [...element.querySelectorAll('*[data-component]')];
    // Sorting by prioritized components
    dataComponents.sort((c1, c2) => {
      const dataComponent = c2.getAttribute('data-component');
      if (dataComponent && dataComponent.indexOf('registerAnalyticsData') >= 0) {
        return 1;
      }
      return -1;
    });

    for (let i = 0; i < dataComponents.length; i++) {
      const component = dataComponents[i];
      const componentNames = component.getAttribute('data-component').split(',');
      componentNames.forEach((item) => {
        try {
          const componentItem = components[item.trim()];
          if (!componentItem) {
            return;
          }

          componentItem().then(({ default: Instance }) => {
            // eslint-disable-next-line no-new
            new Instance(component);
          });
        } catch (err) {
          console.log('comp', item, err);
        }
      });
    }
  }
}

export default new ComponentLoader();
