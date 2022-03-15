export default class Selectbox {
  static defaultOptions = {
    defaultText: '',
    onChange: (value, displayName) => {},
  };

  constructor(selector, options = Selectbox.defaultOptions) {
    this.options = {
      ...this.defaultOptions,
      ...options,
    };
    this.selector = selector;
    this.selectBtnSelector = this.selector.querySelector('.js_selectbox__btn');
    this.selectListOptionsSelector = this.selector.querySelector('.js_selectbox__options');
    this.selectOptionsSelector = [...this.selector.querySelectorAll('.js_selectbox__option')];
    this.defaultText = this.options.defaultText || this.selectBtnSelector.innerText;
    this.bindEvents();
  }

  reset = () => {
    this.selectBtnSelector.innerText = this.defaultText;
    this.selectOptionsSelector = [...this.selector.querySelectorAll('.js_selectbox__option')];
    this.selectOptionsSelector.forEach((optionSelector) => {
      optionSelector.classList.remove('is-active');
    });
  };

  onSubmit = (key, text) => ({ key, text });

  bindEvents = () => {
    this.selectOptionsSelector.forEach((optionSelector) => {
      const { key } = optionSelector.dataset;
      optionSelector.addEventListener('click', this.handleClickOption(key));
    });
  };

  handleClickOption = (key) => (e) => {
    this.selectOptionsSelector.forEach((optionSelector) => {
      this.selectBtnSelector.innerHTML = `<div>${e.target.innerText}</div>`;
      optionSelector.classList.remove('is-active');
      if (optionSelector === e.target) {
        optionSelector.classList.add('is-active');
      }
    });
    if (key) {
      this.selector.classList.add('selected');
    } else {
      this.selector.classList.remove('selected');
    }
    this.onSubmit(key, e.target.innerText);
    this.options.onChange(key, e.target.innerText);
  };

  addMoreOption = (key, text) => {
    const optionEl = document.createElement('div');
    optionEl.classList.add('selectbox__option');
    optionEl.classList.add('js_selectbox__option');
    optionEl.dataset.key = key;
    optionEl.innerText = text;
    this.selectListOptionsSelector.appendChild(optionEl);
    this.selectOptionsSelector = [...this.selector.querySelectorAll('.js_selectbox__option')];
    optionEl.addEventListener('click', this.handleClickOption(key));
  };

  forceSelectKey = (key) => {
    this.selectOptionsSelector.forEach((optionSelector) => {
      if (optionSelector.dataset.key === key) {
        optionSelector.classList.add('is-active');
        this.selectBtnSelector.innerText = optionSelector.innerText;
        this.options.onChange(key, optionSelector.innerText);
      } else {
        optionSelector.classList.remove('is-active');
      }
    });
  };

  addError = () => {
    this.selectBtnSelector.classList.add('error');
  };

  removeError = () => {
    this.selectBtnSelector.classList.remove('error');
  };
}

export const selectBox = (element, options = Selectbox.defaultOptions) => new Selectbox(element, options);
