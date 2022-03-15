import { render } from '../../../core/scripts/ultis/render';
import contentTemplate from './product-bonus.pug';
import ProductBonusServices from './ProductBonusServices';

class ProductBonus {
  constructor(selector) {
    this.component = selector;

    ProductBonusServices.getContent()
      .then((data) => {
        this.data = data;
        this.render();
      })
      .catch(console.log);
  }

  render = () => {
    this.component.innerHTML = render(contentTemplate, this.data);
  };
}

export default ProductBonus;
