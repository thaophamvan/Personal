import Toggler from '../components/toggler';
import PropagationStopper from '../components/propagation-stopper';
import Popup from '../../features/Popup/Popup';
import HeroBannerSlider from '../../features/HeroBanner/HeroBannerSlider';
import MiniCart from '../../features/MiniCart/MiniCart';
import CategoryListSlider from '../../features/CategoryList/CategoryList';
import MainNavigation from '../../features/MainNavigation/MainNavigation';
import BrandListSlider from '../../features/BrandList/BrandList';
import ShoppingCart from '../../features/ShoppingCart/ShoppingCart';
import Category from '../../features/Category/Category';
import Checkout from '../../features/Checkout/Checkout';
import Modal from '../../features/Modal/Modal';
import PlayVideoButton from '../../features/PlayVideoButton/PlayVideoButton';
import ProductDetailInfo from '../../features/ProductDetailInfo/ProductDetailInfo';
//import ListWishlists from '../../features/ListWishlists/ListWishlists';
import ProductDetailSlider from '../../features/ProductDetailSlider/ProductDetailSlider';
// import WishlistDetail from '../../features/WishlistDetail/WishlistDetail';
import MyAccount from '../../features/MyAccount/MyAccount';
import TechSpecification from '../../features/TechSpecification/techspecification';
import Complementary from '../../features/Complementary/complementary';
import YouMayAlsoLike from '../../features/YouMayAlsoLike/YouMayAlsoLike';
import SearchResult from '../../features/SearchResult/SearchResult';
import ProductCompare from '../../features/ProductCompare/ProductCompare';

const components = {
  toggler: (component) => new Toggler(component),
  propagationStopper: (component) => new PropagationStopper(component),
  heroBannerSlider: (component) => new HeroBannerSlider(component),
  popup: (component) => new Popup(component),
  minicart: (component) => new MiniCart(component),
  categoryListSlider: (component) => new CategoryListSlider(component),
  mainNavigation: (component) => new MainNavigation(component),
  brandListSlider: (component) => new BrandListSlider(component),
  shoppingCart: (component) => new ShoppingCart(component),
  category: (component) => new Category(component),
  checkout: (component) => new Checkout(component),
  modal: (component) => new Modal(component),
  playVideoButton: (component) => new PlayVideoButton(component),
  productDetailInfo: (component) => new ProductDetailInfo(component),
  // listWishlists: (component) => new ListWishlists(component),
  productDetailSlider: (component) => new ProductDetailSlider(component),
  // wishlistDetail: (component) => new WishlistDetail(component),
  myAccount: (component) => new MyAccount(component),
  techSpecification: (component) => new TechSpecification(component),
  complementary: (component) => new Complementary(component),
  youMayAlsoLike: (component) => new YouMayAlsoLike(component),
  searchResult: (component) => new SearchResult(component),
  productCompare: (component) => new ProductCompare(component),
};

function ComponentLoader() { }

ComponentLoader.prototype = {
  initialize() { },

  loadComponents(element) {
    const dataComponents = Array.prototype.slice.call(
      element.querySelectorAll('*[data-component]'),
    );
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
      const componentNames = component
        .getAttribute('data-component')
        .split(',');
      componentNames.forEach((item) => {
        try {
          components[item.trim()](component);
        } catch (err) {
          console.log('comp', item, err);
        }
      });
    }
  },
};

export default new ComponentLoader();
