/* eslint-disable no-underscore-dangle */
export default class JsTabs {
  constructor({
    elm,
    onClick,
    onClickHandlerComplete,
    shouldScrollTabIntoView = true,
    enableToggle = false,
    onToggleTab,
    onToggleContent,
  }) {
    this.css = {
      nav: 'js_tabs__nav',
      tab: 'js_tabs__tab',
      contentContainer: 'js_tabs__content-container',
      content: 'js_tabs__content',
      marker: 'js_tabs__marker',
      active: 'active',
      inactive: 'inactive',
    };

    this.settings = {
      shouldScrollTabIntoView,
      enableToggle,
      onToggleTab,
      onToggleContent,
    };
    this.jsTabsElm = this._getJsTabsElm(elm);
    this.onClick = onClick;
    this.onClickHandlerComplete = onClickHandlerComplete;

    this.navElm = this.jsTabsElm.querySelector(`.${this.css.nav}`);
    this.markerElm = this.jsTabsElm.querySelector(`.${this.css.nav} .${this.css.marker}`);
    this.tabsAdjustInProgress = false;
  }

  init = () => {
    this._setupEventListeners();
    this._adjustTabs();
  }

  destroy = () => {
    this.navElm.removeEventListener('click', this._onClick);
    window.removeEventListener('resize', this._handleResize);
  }

  setInactiveMode = () => {
    [...this.jsTabsElm.querySelectorAll(`.${this.css.tab}`)].forEach(jsTabElm => {
      jsTabElm.classList.add(this.css.inactive);
      jsTabElm.classList.remove(this.css.active);
    });

    [...this.jsTabsElm.querySelectorAll(`.${this.css.content}`)].forEach(jsTabContentElm => {
      jsTabContentElm.classList.remove(this.css.active);
    });
  }

  setNormalModeTab = () => {
    [...this.jsTabsElm.querySelectorAll(`.${this.css.tab}`)].forEach(jsTabElm => {
      jsTabElm.classList.remove(this.css.active);
      jsTabElm.classList.remove(this.css.inactive);
    });
  }

  setNormalModeContent = () => {
    [...this.jsTabsElm.querySelectorAll(`.${this.css.content}`)].forEach(jsTabContentElm => {
      jsTabContentElm.classList.remove(this.css.active);
    });
  }

  _getJsTabsElm = (_elm) => {
    if (typeof _elm === 'string') {
      const elm = document.querySelector(_elm);
      if (!elm) {
        throw new Error('JS Tabs: Invalid selector passed for elm');
      }
      return elm;
    }
    return _elm;
  }

  _setupEventListeners = () => {
    this.navElm.addEventListener('click', this._onClick);
    window.addEventListener('resize', this._handleResize);
  }

  _adjustTabs = (useTimeout) => {
    const _adjust = () => {
      const activeTab = this.jsTabsElm.querySelector(`.${this.css.tab}.${this.css.active}`);
      if (activeTab === null) {
        return;
      }
      this._repositionMarker(activeTab);
      this.tabsAdjustInProgress = false;
    };

    if (this.tabsAdjustInProgress) {
      return;
    }
    this.tabsAdjustInProgress = true;
    if (useTimeout) {
      window.setTimeout(_adjust, 300);
    } else {
      _adjust();
    }
  }

  _onClick = (e) => {
    e.stopPropagation();
    const { target } = e;
    let tab = target;
    if (!target.classList.contains(this.css.tab)) {
      tab = target.closest(`.${this.css.tab}`);
      if (!tab) {
        return;
      }
    }
    if(this.onClick) {
      this.onClick();
    }
    this._changeActiveTab(tab);
    if (this.settings.shouldScrollTabIntoView) {
      this._scrollToTab(tab);
    }
    this._repositionMarker(tab);
    this._changeContent(tab);
    if (this.onClickHandlerComplete) {
      this.onClickHandlerComplete(tab);
    }
  }

  _changeActiveTab = (tab) => {
    const parent = tab.parentNode;
    const tabs = parent.children;
    for (const t of tabs) {
      t.classList.add(this.css.inactive);

      if (t.classList.contains(this.css.active)) {
        t.classList.remove(this.css.active);

        if (this.settings.enableToggle && t == tab) {
          this.settings.onToggleTab && this.settings.onToggleTab();
          return;
        }

        break;
      }
    }

    tab.classList.remove(this.css.inactive);
    tab.classList.add(this.css.active);
  }

  _scrollToTab = (tab) => {
    tab.scrollIntoView({ behavior: 'smooth' });
  }

  _repositionMarker = (tab) => {
    if (!this.markerElm) {
      return;
    }
    const xValue = tab.offsetLeft;
    this.markerElm.style.transform = `translateX(${xValue}px)`;
    this.markerElm.style.width = `${tab.offsetWidth}px`;
    this.markerElm.style.backgroundColor = window.getComputedStyle(tab).color;
  }

  _changeContent = (tab) => {
    const parent = tab.parentNode;
    const index = Array.prototype.indexOf.call(parent.children, tab);
    const contentChildren = this.jsTabsElm.querySelector(`.${this.css.contentContainer}`).children;
    const contentItemElms = Array.prototype.slice.call(contentChildren).filter((child) => child.classList.contains(this.css.content));

    for (const contentItemElm of contentItemElms) {
      if (contentItemElm.classList.contains(this.css.active)) {
        contentItemElm.classList.remove(this.css.active);

        if (this.settings.enableToggle && contentItemElm == contentItemElms[index]) {
          this.settings.onToggleContent && this.settings.onToggleContent();
          return;
        }
        
        break;
      }
    }

    contentItemElms[index].classList.add(this.css.active);
  }

  _handleResize = () => {
    this._adjustTabs(true);
  }
}
