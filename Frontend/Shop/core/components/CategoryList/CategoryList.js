import Glide from '@glidejs/glide'; // eslint-disable-line import/no-extraneous-dependencies
import { arrowDisable } from '../../scripts/ultis/slider';

class CategoryListSlider {
  slideBreakpoints = {
    default: {
      perView: 8,
    },
    1399: {
      perView: 6,
    },
    1279: {
      perView: 5,
    },
    991: {
      perView: 4.5,
    },
    767: {
      perView: 3.5,
    },
    639: {
      perView: 2.5,
    },
  };

  slider = null;

  showAll = false;

  constructor(selector) {
    this.component = selector;
    this.categoryToggleButton = this.component.querySelector('.js_category-list__title-button');
    this.categoryListItem = [...this.component.querySelectorAll('.glide__slide')];
    this.sliderComponent = this.component.querySelector('.js_category-list__slider');
    this.buildSlider();
    this.bindingEvent();
  }

  buildSlider = () => {
    let sliderWidth = this.sliderComponent.offsetWidth;
    const numberCategory = this.categoryListItem.length;
    const clientWidth = document.body.offsetWidth;
    const breakpointView = this.getCurrentBreakPoint().perView;

    const { default: defaultBreakpoint, ...breakpoints } = this.slideBreakpoints;
    this.slider = new Glide(this.sliderComponent, {
      type: 'slider',
      bound: true,
      rewind: false,
      perView: defaultBreakpoint.perView,
      gap: 10,
      breakpoints,
    });
    this.sliderComponent.classList.remove('no-slider');
    this.showAll = false;
    this.categoryToggleButton.innerText = 'view all';
    if (sliderWidth === 0) {
      this.component.parentElement.classList.add('active');
      sliderWidth = this.sliderComponent.offsetWidth;
      this.slider.mount({ arrowDisable });
      this.component.parentElement.classList.remove('active');
    } else {
      this.slider.mount({ arrowDisable });
    }
    if ((sliderWidth / breakpointView) * numberCategory < clientWidth) {
      this.sliderComponent.classList.add('no-slider');
      if (this.slider) {
        this.slider.destroy();
        this.slider = null;
      }
    }
  };

  bindingEvent() {
    if (this.categoryToggleButton) {
      this.categoryToggleButton.onclick = this.handleToggleShowAll;
    }
    this.originWidth = document.body.offsetWidth;
    window.addEventListener('resize', () => {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(() => {
        if (this.originWidth !== document.body.offsetWidth) {
          this.originWidth = document.body.offsetWidth;
          if (this.slider) {
            this.slider.destroy();
            this.slider = null;
          }
          this.buildSlider();
        }
      }, 500);
    });
  }

  handleToggleShowAll = () => {
    this.showAll = !this.showAll;
    if (this.showAll) {
      this.categoryToggleButton.innerText = 'show less';
      this.sliderComponent.classList.add('no-slider');
      this.slider.destroy();
      this.slider = null;
    } else {
      this.categoryToggleButton.innerText = 'view all';
      this.sliderComponent.classList.remove('no-slider');
      this.buildSlider();
    }
  };

  getCurrentBreakPoint = () => {
    const width = document.body.offsetWidth;
    let breakpoint = 0;
    let range = 0;
    Object.keys(this.slideBreakpoints).forEach((breakpointWidth) => {
      const rangeWidth = width - (breakpointWidth - 1);
      if (rangeWidth < 0) {
        if (range && rangeWidth > range) {
          range = rangeWidth;
          breakpoint = breakpointWidth;
        }
        if (!range) {
          range = rangeWidth;
          breakpoint = breakpointWidth;
        }
      }
    });
    return range ? this.slideBreakpoints[breakpoint] : this.slideBreakpoints.default;
  };
}

export default CategoryListSlider;
