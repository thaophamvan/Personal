import Glide from '@glidejs/glide';

class HeroBannerSlider {
  constructor(selector) {
    this.component = selector;
    this.buildSlider();
  }

  initSlider = () => {
  };

  buildSlider = () => {
    const slider = new Glide(this.component, {
      type: 'slider',
      bound: true,
      rewind: true,
      perView: 1,
      gap: 0,
    });

    slider.mount();
    return slider;
  };
}

export default HeroBannerSlider;
