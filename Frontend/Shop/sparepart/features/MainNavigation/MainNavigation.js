import { isMobileViewport } from '../../../core/scripts/ultis/devices';
import { findPnc } from '../RightNavigationFindPnc/FindPnc';
import { getScrollbarWidth } from '../../../core/scripts/ultis/getScrollBarWidth';
import globalSearchVue from './globalSearchVue';

export default class MainNavigation {
    isShowMenu = false;

    subCategory = null;

    activeMenuState = {};

    constructor(selector) {
        this.component = selector;
        this.topNav = this.component.querySelector('.js_top-nav');
        this.burgerBtn = this.component.querySelector('.js_top-nav__burger');
        this.closeMenuBtn = this.component.querySelector('.js_top-nav__menu-close-icon');
        this.overlayBg = document.body.querySelector('.overlay-bg');
        this.menuContainer = this.component.querySelector('.js_top-nav__menu--container');
        this.menuBodyWrapper = this.component.querySelector('.js_top-nav__menu-body-wrapper');
        this.mainMenuBtn = this.component.querySelector('.js_top-nav__main-menu-btn');
        this.searchIconSelector = this.component.querySelector('.js_top-nav__search-icon');
        this.closeSearchIconSelector = this.component.querySelector('.js_top-nav__close-search-icon');
        this.findPncBtn = this.component.querySelector('.js_top-nav__find-pnc-btn');
        this.inputSearchSelector = this.component.querySelector('.js_top-nav__search-input');
        this.searchAreaSelector = this.component.querySelector('.js_top-nav__search-area');
        this.searchResultsSelector = this.component.querySelector('.js_top-nav__search-results');
        this.inputSearchMobileSelector = this.component.querySelector('.js_top-nav__search-input-mobile');
        this.submitSearchIconSelector = this.component.querySelector('.js_top-nav__submit-search-icon');
        this.searchForm = document.querySelector('.js_top-nav__search-form');
        this.searchMobileForm = this.component.querySelector('.js_top-nav__search-form-mobile');
        this.siteSearchUrl = this.searchForm.getAttribute('data-site-search-url');
        this.header = document.querySelector('.js_header');
        this.topHeader = this.header.querySelector('.top-header');
        this.originWidth = window.innerWidth;

        this.initEvent();
    }

    initEvent = () => {
        this.burgerBtn.onclick = this.showMenu;
        this.closeMenuBtn.onclick = this.hideMenu;
        this.menuContainer.onclick = this.handleClickMenuContainer;
        this.mainMenuBtn.onclick = this.showMenuOnDesktop;
        this.searchForm.addEventListener('keypress', this.handleSubmitSearch);
        this.searchMobileForm.addEventListener('keypress', this.handleSubmitSearchMobile);
        this.searchIconSelector.addEventListener('click', this.showSearchArea);
        window.addEventListener('resize', this.handleResizeWindow);
        if (this.inputSearchSelector) {
            this.inputSearchSelector.addEventListener('input', this.handleChangeInput);
            this.inputSearchSelector.addEventListener('focus', this.handleFocusInputSearch);
        }
        if (this.submitSearchIconSelector) {
            this.submitSearchIconSelector.addEventListener('click', () => {
                if (this.inputSearchSelector.value.trim().length >= 1) {
                    window.location.href = `${window.location.origin}${this.siteSearchUrl}${this.inputSearchSelector.value.trim()}`;
                }
            });
        }
        this.findPncBtn.addEventListener('click', (e) => {
            e.preventDefault();
            findPnc().show();
        });
        this.handleOutsideClick();
        this.searchResultsInstance = globalSearchVue(this.searchResultsSelector);
        this.searchResultsInstance.input = this.inputSearchSelector;
        this.searchResultsInstance.$on('loadingData', this.showSpinner);
        this.searchResultsInstance.$on('loadedData', this.hideSpinner);
        document.body.addEventListener('click', (event) => {
            this.handleDisplaySearchResult(event);
            this.hideSearchAreaDesktop(event);
        });
    };

    handleClickMenuContainer = (event) => {
        const { target } = event;
        const parentTarget = target.parentNode;
        const subMenuId = target.dataset.subMenu || parentTarget.dataset.subMenu;
        if (subMenuId) {
            this.showSubMenu(subMenuId, target.dataset.subMenu ? target : parentTarget);
        }

        if (target.dataset.closeSubMenuBtn !== undefined || parentTarget.dataset.closeSubMenuBtn !== undefined) {
            this.hideSubMenu(target);
        }
    };

    showMenuOnDesktop = () => {
        if (this.menuContainer.classList.contains('md-active')) {
            this.hideMenuOnDesktop();
            return;
        }
        
        const bodyHeight = document.documentElement.clientHeight;
        const menuMaxHeight = +window
            .getComputedStyle(this.menuContainer)
            .getPropertyValue('max-height')
            .replace('px', '');
        if (bodyHeight - this.header.offsetHeight < menuMaxHeight) {
            this.menuContainer.style.height = `${bodyHeight - this.header.offsetHeight}px`;
        }
        this.menuContainer.classList.add('md-active');
        setTimeout(() => {
            this.menuContainer.classList.add('md-view');
        }, 0);
        this.overlayBg.style.display = 'block';
        this.mainMenuBtn.classList.add('hover');
        document.body.style.overflow = 'hidden';
        const scrollBarWidth = getScrollbarWidth();
        document.body.style.paddingRight = `${scrollBarWidth}px`;
        this.topHeader.style.paddingRight = `${+window
            .getComputedStyle(this.topHeader)
            .getPropertyValue('padding-right')
            .replace('px', '') + scrollBarWidth}px`;
        this.topNav.style.paddingRight = `${+window
            .getComputedStyle(this.topNav)
            .getPropertyValue('padding-right')
            .replace('px', '') + scrollBarWidth}px`;
        this.searchAreaSelector.style.right = `${+window
            .getComputedStyle(this.searchAreaSelector)
            .getPropertyValue('right')
            .replace('px', '') + scrollBarWidth}px`;
    };

    hideMenuOnDesktop = () => {
        this.menuContainer.classList.remove('md-view');
        this.menuContainer.style.removeProperty('height');
        setTimeout(() => {
            this.menuContainer.classList.remove('md-active');
        }, 300);
        this.overlayBg.style.display = 'none';
        this.mainMenuBtn.classList.remove('hover');
        const scrollBarWidth = getScrollbarWidth();
        document.body.style.overflow = 'auto';
        document.body.style.removeProperty('padding-right');
        this.topHeader.style.paddingRight = `${+window
            .getComputedStyle(this.topHeader)
            .getPropertyValue('padding-right')
            .replace('px', '') - scrollBarWidth}px`;
        this.topNav.style.paddingRight = `${+window
            .getComputedStyle(this.topNav)
            .getPropertyValue('padding-right')
            .replace('px', '') - scrollBarWidth}px`;
        this.searchAreaSelector.style.right = `${+window
            .getComputedStyle(this.searchAreaSelector)
            .getPropertyValue('right')
            .replace('px', '') - scrollBarWidth}px`;
    };

    showSubMenu = (subMenu, target) => {
        const activeMenu = this.menuContainer.querySelector(`#${subMenu}`);
        const { parentMenu } = activeMenu.dataset;
        this.menuBodyWrapper.scrollTop = 0;
        const parentMenuEl = this.menuContainer.querySelector(parentMenu);

        // hide existed active menu
        if (this.activeMenuState[parentMenu] && this.activeMenuState[parentMenu].activeMenu) {
            this.activeMenuState[parentMenu].activeMenu.classList.remove('is-active');
            this.activeMenuState[parentMenu].activeMenu.style.display = 'none';
            this.activeMenuState[parentMenu].target.classList.remove('active');
            if (subMenu && this.activeMenuState[parentMenu][subMenu]) {
                this.activeMenuState[parentMenu][subMenu].classList.remove('active');
            }
        }

        activeMenu.style.display = 'block';
        activeMenu.classList.add('is-active');
        target.classList.add('active');
        this.activeMenuState[parentMenu] = {
            activeMenu,
            target,
        };
        if (subMenu) {
            this.activeMenuState[parentMenu][subMenu] = target;
        }

        parentMenuEl.classList.add('show-sub-menu');
    };

    hideSubMenu = (target) => {
        const activeMenu = target.closest('.is-active');
        activeMenu.classList.remove('is-active');
        const parentMenu = this.menuContainer.querySelector(activeMenu.dataset.parentMenu);
        parentMenu.classList.remove('show-sub-menu');
        setTimeout(() => {
            activeMenu.style.display = 'none';
        }, 300);
    };

    showMenu = () => {
        this.isShowMenu = true;
        this.menuContainer.classList.add('active');
        this.topNav.classList.add('active-menu');
        this.showOverlayBg();
    };

    showOverlayBg = () => {
        this.overlayBg.style.display = 'block';
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${getScrollbarWidth()}px`;
        this.topNav.style.paddingRight = `${getScrollbarWidth() + 15}px`;
    };

    hideOverlayBg = () => {
        this.overlayBg.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.body.style.removeProperty('padding-right');
        this.topNav.style.paddingRight = '15px';
    };

    hideMenu = () => {
        this.isShowMenu = false;
        this.menuContainer.classList.remove('active');
        this.topNav.classList.remove('active-menu');
        this.hideOverlayBg();
    };

    handleOutsideClick = () => {
        document.body.addEventListener('click', (event) => {
            if (!this.menuContainer.contains(event.target) && !this.burgerBtn.contains(event.target) && this.isShowMenu) {
                this.hideMenu();
            }

            if (this.menuContainer.classList.contains('md-view') && !this.menuContainer.contains(event.target) && !this.mainMenuBtn.contains(event.target)) {
                this.hideMenuOnDesktop();
            }
        });
    };

    handleChangeInput = (e) => {
        const { value } = e.target;
        this.fetchGlobalSearch(value);
    };

    handleSubmitSearch = (e) => {
        //e.preventDefault();
        let key=e.keyCode || e.which;
        if (key === 13 && this.inputSearchSelector.value.trim().length >= 1) {
            window.location.href = `${window.location.origin}${this.siteSearchUrl}${this.inputSearchSelector.value.trim()}`;
        }
    };

    handleSubmitSearchMobile = (e) => {
        //e.preventDefault();
        let key=e.keyCode || e.which;
        if (key === 13 && this.inputSearchMobileSelector.value.trim().length >= 1) {
            window.location.href = `${window.location.origin}${this.siteSearchUrl}${this.inputSearchMobileSelector.value.trim()}`;
        }
    };

    fetchGlobalSearch = (value) => {
        if (value.trim().length < 3) {
            this.searchResultsInstance.show = false;
            this.hideSpinner();
            return;
        }
        this.searchResultsInstance.fetchData();
    };

    showSpinner = () => {
        if (!this.spinnerLoading) {
            this.createSpinner();
        }
        this.spinnerLoading.classList.add('show');
    };

    hideSpinner = () => {
        if (this.spinnerLoading) {
            this.spinnerLoading.classList.remove('show');
        }
    };

    createSpinner = () => {
        this.spinnerLoading = document.createElement('div');
        this.spinnerLoading.className = 'top-nav__lds-spinner lds-spinner';
        this.spinnerLoading.innerHTML = new Array(12).fill('<div></div>').join('');
        this.searchAreaSelector.appendChild(this.spinnerLoading);
    };

    handleDisplaySearchResult = (e) => {
        if (!this.inputSearchSelector?.contains(e.target) && !this.searchResultsSelector?.contains(e.target)) {
            this.searchResultsInstance.show = false;
        }
    };

    handleFocusInputSearch = (e) => {
        this.fetchGlobalSearch(e.target.value);
        this.showSearchAreaDesktop();
    };

    showSearchAreaDesktop = () => {
        this.searchAreaSelector.classList.add('show');
    };

    showSearchArea = () => {
        this.searchAreaSelector.classList.add('show');
        this.searchIconSelector.classList.add('hide');
        this.closeSearchIconSelector.classList.add('show');
        this.inputSearchSelector.focus();
        this.createBackdrop();
        document.body.addEventListener('click', this.hideSearchArea);
    };

    handleResizeWindow = () => {
        if (this.originWidth !== window.innerWidth) {
            this.originWidth = window.innerWidth;
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            this.resizeTimeout = setTimeout(() => {
                this.hideSearchArea();
                this.removeBackdrop();
                if (isMobileViewport()) {
                    this.hideMenuOnDesktop();
                } else {
                    this.hideMenu();
                }
            }, 0);
        }
    };

    createBackdrop = () => {
        this.backdrop = document.createElement('div');
        this.backdrop.classList.add('top-nav__search-bd');
        document.body.appendChild(this.backdrop);
    };

    removeBackdrop = () => {
        if (this.backdrop) {
            this.backdrop.remove();
        }
    };

    hideSearchAreaDesktop = () => {
        this.inputSearchSelector.blur();
        this.searchAreaSelector.classList.remove('show');
    };

    hideSearchArea = (cleanValue = false) => {
        this.closeSearchIconSelector.classList.remove('show');
        this.searchIconSelector.classList.remove('hide');
        this.searchAreaSelector.classList.remove('show');
        if (cleanValue) {
            this.inputSearchSelector.value = null;
            this.searchResultsInstance.show = false;
            this.searchResultsInstance.searchResults = null;
        }
        document.body.removeEventListener('click', this.hideSearchArea);
        window.removeEventListener('click', this.hideSearchArea);
        this.removeBackdrop();
    };
}
