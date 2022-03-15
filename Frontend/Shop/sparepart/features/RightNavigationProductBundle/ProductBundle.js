import { render } from '../../../core/scripts/ultis/render';
import contentTemplate from './product-bundle.pug';
import bundleItemTemplate from './product-bundle-item.pug';
import ProductBundleServices from './ProductBundleServices';

class ProductBundle {
  constructor(selector) {
    this.component = selector;

    ProductBundleServices.getContent()
      .then((data) => {
        this.data = data;
        this.render();
      })
      .catch(console.log);
  }

  render = () => {
    this.component.innerHTML = render(contentTemplate, this.data);
    this.items = this.component.querySelector('.product-bundle__content-items');

    this.data.bundleItems.forEach((item) => {
      this.items.innerHTML += render(bundleItemTemplate, item);
    });
  };
}

export default ProductBundle;
