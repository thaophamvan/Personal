import Glide from '@glidejs/glide';
import { arrowDisable } from '../../scripts/ultis/slider';

class ProductDetailSlider {
  constructor(selector) {
    this.component = selector;
    this.buildSlider(arrowDisable);
  }

  buildSlider = (arrow) => {
    const slider = new Glide(this.component, {
      type: 'slider',
      perView: 1,
      bound: true,
      rewind: false,
      gap: 0,
    });
    slider.mount({ arrowDisable: arrow });
  };
}

export default ProductDetailSlider;
