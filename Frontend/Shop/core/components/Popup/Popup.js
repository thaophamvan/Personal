import registerWindowOnScroll from '../../scripts/ultis/scroll';


export default class Popup {
  DATA_TYPE = {
    COLLAPSE: 'collapse',
    POPUP: 'popup',
    SELECT: 'select',
  };

  constructor(element, hasBindEvents = true) {
    this.selector = element;
    this.dataType = this.selector.dataset.type || 'popup';
    this.dataRoot = this.selector.dataset.root || 'window';
    this.dataTarget = this.selector.dataset.target;
    this.displayBackdrop = this.selector.dataset.backdrop !== undefined;
    this.displayArrow = this.selector.dataset.hasarrow !== undefined;
    this.hasWrapper = this.selector.dataset.haswrapper !== undefined;
    this.backdropEl = null;
    this.target = this.getTarget();
    this.parentTarget = this.getParentTarget();
    this.initPopup();
    if (hasBindEvents) {
      // this.cleanEvents();
      this.bindingEvent();
    }
  }

  initPopup = () => {
    const { style } = this.selector;
    if (this.selector.classList.contains('is-active')) {
      this.target.classList.add('show');
      const { scrollHeight } = this.target;
      this.target.style.height = `${scrollHeight}px`;
    }
    style.position = 'relative';
    if (this.dataType === this.DATA_TYPE.POPUP || this.hasWrapper) {
      this.renderWrapper();
    }
    if (this.displayArrow) {
      this.addArrow();
    }
    if (this.parentTarget) {
      setTimeout(() => {
        this.parentTarget.style.height = `${this.parentTarget.offsetHeight}px`;
      }, 500);
    }
  };

  bindingEvent = () => {
    this.selector.addEventListener('click', this.handleClick);
    if (this.dataType === this.DATA_TYPE.POPUP) {
      document.querySelector('html').addEventListener('click', this.handleWindowClick);
    }
    if (this.dataType === this.DATA_TYPE.SELECT || this.dataType === this.DATA_TYPE.POPUP) {
      registerWindowOnScroll(this.closePopup, this.dataTarget);
      document.querySelector('html').addEventListener('click', (e) => {
        if (!this.selector.contains(e.target)) {
          this.closePopup();
        }
      });
    }

    window.addEventListener('resize', () => {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(() => {
        this.updateHeight();
      }, 100);
    });
  };

  handleClick = (e) => {
    const { classList, style, scrollHeight } = this.target;
    if (classList.contains('show')) {
      classList.remove('show');
      this.selector.classList.remove('is-active');
      this.cleanBackdrop();
      style.height = null;
      // update parent target
      if (this.parentTarget) {
        this.parentTarget.style.height = `${this.parentTarget.scrollHeight - scrollHeight}px`;
      }
    } else {
      this.selector.classList.add('is-active');
      if (this.displayBackdrop) {
        this.backdropEl = this.renderBackdrop();
      }
      //manually lazyload image
      let lazyImgs = this.target.querySelectorAll('.lazyImg-manually');
      [...lazyImgs].forEach(img => {
          if (!img.dataset.loaded) {
              img.src = img.dataset.src;
              img.dataset.loaded = true;
          }
      });
      // set position for popup
      classList.add('show');
      style.height = this.dataType === this.DATA_TYPE.COLLAPSE ? `${scrollHeight}px` : 'auto';
      if (this.parentTarget) {
        const parentTargetSelector = document.querySelector(`[data-target="${this.selector.dataset.parent}"]`);
        parentTargetSelector.classList.add('is-active');
        this.parentTarget.classList.add('show');
        this.parentTarget.style.height = `${this.parentTarget.scrollHeight + scrollHeight}px`;
      }
    }
  };

  getTarget = () => {
    const { dataset } = this.selector;
    return dataset.target && document.getElementById(dataset.target);
  };

  getParentTarget = () => {
    const { dataset } = this.selector;
    return dataset.parent && document.getElementById(dataset.parent);
  };

  handleWindowClick = (e) => {
    if (!this.selector.contains(e.target) && this.dataRoot === 'window') {
      this.selector.classList.remove('is-active');
      this.target.classList.remove('show');
      this.target.style.height = this.dataType === this.DATA_TYPE.COLLAPSE && null;
      this.cleanBackdrop();
    }
  };

  closePopup = () => {
    this.selector.classList.remove('is-active');
    this.target.classList.remove('show');
    this.target.style.height = this.dataType === this.DATA_TYPE.COLLAPSE && null;
    this.cleanBackdrop();
  };

  renderBackdrop = () => {
    const backdrop = document.createElement('div');
    backdrop.classList.add('popup__backdrop');
    document.body.appendChild(backdrop);
    return backdrop;
  };

  cleanBackdrop = () => this.backdropEl && this.backdropEl.remove();

  addArrow = () => {
    const el = document.createElement('div');
    el.classList.add('popup__arrow-box');
    this.target.insertBefore(el, this.target.childNodes[0]);
  };

  renderWrapper = () => {
    const wrapperEL = `<div class="popup__content">${this.target.innerHTML}</div>`;
    this.target.innerHTML = wrapperEL;
  };

  deletePopup = () => {
    this.selector.remove();
    this.target.remove();
  };

  updateHeight = () => {
    if (this.dataType === this.DATA_TYPE.POPUP) {
      return;
    }

    if (this.parentTarget && this.parentTarget.classList.contains('show')) {
      let bodyWrapper;
      let index = 0;
      while (index < this.parentTarget.childNodes.length) {
        if (this.parentTarget.childNodes[index].nodeName !== '#text') {
          bodyWrapper = this.parentTarget.childNodes[index];
          break;
        }
        index += 1;
      }
      if (bodyWrapper && this.parentTarget.offsetHeight !== bodyWrapper.offsetHeight) {
        this.parentTarget.style.height = `${bodyWrapper.offsetHeight}px`;
      }
    }
    if (this.target && this.target.classList.contains('show')) {
      const wrapperEl = this.target.querySelector('.popup__content');
      if (wrapperEl) {
        this.target.style.height = `${wrapperEl.offsetHeight}px`;
      }
    }
  };
}

export const popup = (selector, hasBindEvents = true) => new Popup(selector, hasBindEvents);
