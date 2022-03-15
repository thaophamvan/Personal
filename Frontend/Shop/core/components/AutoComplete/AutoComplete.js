import { emptyDOM } from '../../scripts/ultis/dom';
import HttpCancelError from '../../scripts/ultis/HttpCancelError';

export default class AutoComplete {
  static defaultOptions = {
    input: null,
    scrollInfinite: false,
    emptyMsg: 'No items found',
    minLength: 1,
    elementAppend: document.body,
    render: () => {},
    onSelect: () => {},
    onFocusOut: () => {},
    onLoading: () => {},
    onComplete: () => {},
    className: '',
    // request data object
    data: {},
    delay: 500,
    maxHeight: 235,
    page: 1,
    offset: 50,
    service: () => {}, // async service
    dataResponseKey: 'Data',
    dataResponseHasNextPageKey: 'HasNextPage',
  };

  page = 1;

  hasMore = false;

  isLoadingMore = false;

  dataResponse = [];

  selectedIndex = -1;

  itemRefs = [];

  constructor(options) {
    this.options = { ...AutoComplete.defaultOptions, ...options };
    this.page = this.options.page;
    this.input = this.options.input;
    if (!this.input) {
      return;
    }
    this.addEvent();
    this.createContainer();
  }

  addEvent = () => {
    const { input } = this.options;
    if (input) {
      input.addEventListener('focus', this.handleFocusInput);
      document.addEventListener('click', this.handleClick);
      input.addEventListener('keydown', this.handleKeyDown);
      input.addEventListener('input', this.handleInputChange);
      window.addEventListener('resize', this.calculatePositionContainer);
    }
  };

  handleClick = (e) => {
    if (!this.container.contains(e.target) && !this.input.contains(e.target)) {
      this.handleOutFocusInput();
    }
  };

  calculatePositionContainer = () => {
    this.container.style.top = `${this.input.getBoundingClientRect().top + window.pageYOffset + this.input.offsetHeight}px`;
    this.container.style.left = `${this.input.getBoundingClientRect().left + window.pageXOffset}px`;
    this.container.style.width = `${this.input.offsetWidth}px`;
  };

  handleFocusInput = () => {
    this.isHidden = false;
    this.calculatePositionContainer();
    this.cleanTimeout();
    this.handleRequest(this.input.value);
  };

  cleanTimeout = () => {
    if (this.requestTimeout) {
      clearTimeout(this.requestTimeout);
    }
  };

  handleKeyDown = (e) => {
    switch (e.keyCode) {
      case 13: // enter
        e.preventDefault();
        this.input.blur();
        this.hideSuggestionContainer();
        break;
      case 27: // escape
        e.preventDefault();
        this.input.blur();
        this.hideSuggestionContainer();
        break;
      case 40: // arrow down
        e.preventDefault();
        this.moveDown();
        break;
      case 38: // arrow up
        e.preventDefault();
        this.moveUp();
        break;
      default:
        break;
    }
  };

  moveDown = () => {
    if (this.itemRefs.length === 0) {
      return;
    }

    this.selectedIndex += 1;

    if (this.selectedIndex === this.itemRefs.length) {
      this.selectedIndex = 0;
    }

    this.selectItem();

    const { el } = this.itemRefs[this.selectedIndex] || {};
    if (el.offsetTop + el.offsetHeight > this.container.offsetHeight + this.container.scrollTop) {
      this.container.scrollTop = el.offsetTop;
    }
    if (this.selectedIndex <= 0) {
      this.container.scrollTop = 0;
    }
  };

  moveUp = () => {
    if (this.itemRefs.length === 0) {
      return;
    }
    this.selectedIndex -= 1;

    if (this.selectedIndex < 0) {
      this.selectedIndex = this.itemRefs.length - 1;
    }

    this.selectItem();

    const { el } = this.itemRefs[this.selectedIndex] || {};
    if (el.offsetTop < this.container.scrollTop) {
      this.container.scrollTop = el.offsetTop - this.container.offsetHeight + el.offsetHeight;
    }
    if (this.selectedIndex >= this.itemRefs.length - 1) {
      this.container.scrollTop = el.offsetTop;
    }
  };

  selectItem = () => {
    const { el, item } = this.itemRefs[this.selectedIndex] || {};

    if (!el) {
      return;
    }
    this.itemRefs.forEach((ref) => ref.el.classList.remove('active'));
    el.classList.add('active');
    const text = this.options.render(item);
    this.input.value = text;
    this.options.onSelect(item);
  };

  handleOutFocusInput = () => {
    const { onFocusOut } = this.options;
    this.cleanTimeout();
    this.hideSuggestionContainer();
    onFocusOut();
  };

  handleInputChange = ({ target }) => {
    this.isHidden = false;
    let { value } = target;
    const { delay } = this.options;
    // not allow input white space on first letter;
    if (value === ' ') {
      value = '';
    }
    value = target.value.trim();
    this.cleanTimeout();
    this.requestTimeout = setTimeout(() => this.handleRequest(value), delay);
  };

  handleRequest = (value) => {
    const { minLength, onLoading, onComplete } = this.options;
    this.page = 1;
    if (value.length < minLength) {
      this.hideSuggestionContainer();
      return;
    }
    onLoading();
    this.options
      .service(value, this.page, this.options.data)
      .then((res) => {
        onComplete();
        this.dataResponse = res[this.options.dataResponseKey];
        this.render(res[this.options.dataResponseKey] || []);
        this.hasMore = res[this.options.dataResponseHasNextPageKey];
      })
      .catch((err) => {
        onComplete();
        if (err instanceof HttpCancelError) {
          return;
        }
        this.hasMore = false;
        this.render([]);
      });
  };

  registerScrollEvent = () => {
    this.container.addEventListener('scroll', this.handleScroll);
  };

  handleScroll = ({ target }) => {
    if (!this.options.scrollInfinite) {
      return;
    }

    const { offset } = this.options;
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - offset && this.hasMore) {
      this.handleLoadMore();
    }
  };

  handleLoadMore = () => {
    if (!this.isLoadingMore) {
      this.isLoadingMore = true;
      this.page += 1;
      this.options
        .service(this.input.value, this.page, this.options.data)
        .then((res) => {
          this.renderMore(res[this.options.dataResponseKey]);
          this.hasMore = res[this.options.dataResponseHasNextPageKey];
          this.isLoadingMore = false;
        })
        .catch((err) => {
          this.isLoadingMore = false;
          this.hasMore = false;
        });
    }
  };

  renderMore = (data) => {
    this.renderData(data, true);
  };

  render = (data) => {
    if (!this.isHidden) {
      this.showSuggestionContainer();
      if (data.length === 0) {
        this.container.childNodes[0].innerText = this.options.emptyMsg;
        return;
      }
      this.itemRefs = [];
      this.renderData(data);
    }
  };

  renderData = (data, renderMore = false) => {
    const { render } = this.options;
    const wrapperItems = document.createElement('div');
    data.forEach((item) => {
      const el = document.createElement('div');
      const text = render(item);
      el.innerText = text;
      el.addEventListener('click', this.handleSelectItem(item));
      this.itemRefs.push({ el, item });
      el.classList.add('auto-suggestion__item');
      if (renderMore) {
        this.container.childNodes[0].appendChild(el);
      } else {
        wrapperItems.appendChild(el);
      }
    });

    if (!renderMore) {
      this.container.replaceChild(wrapperItems, this.container.childNodes[0]);
    }
  };

  handleSelectItem = (item) => () => {
    const { onSelect, render } = this.options;
    onSelect(item);
    this.hideSuggestionContainer();
    this.input.value = render(item);
  };

  hideSuggestionContainer = () => {
    this.isHidden = true;
    this.selectedIndex = -1;
    this.container.classList.remove('show');
    emptyDOM(this.container.childNodes[0]);
    this.page = 1;
    this.hasMore = false;
    this.isLoadingMore = false;
    this.dataResponse = [];
    this.itemRefs = [];
  };

  showSuggestionContainer = () => {
    this.container.classList.add('show');
    this.calculatePositionContainer();
    this.isHidden = false;
  };

  createContainer = () => {
    const { className, maxHeight } = this.options;
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';
    this.container.style.maxHeight = `${maxHeight}px`;
    this.container.className = `auto-suggestion ${className}`;
    const wrapperItems = document.createComment('div');
    this.container.appendChild(wrapperItems);
    const { elementAppend } = this.options;
    elementAppend.appendChild(this.container);
    this.registerScrollEvent();
  };
}

export const autoComplete = (options = AutoComplete.defaultOptions) => new AutoComplete(options);
