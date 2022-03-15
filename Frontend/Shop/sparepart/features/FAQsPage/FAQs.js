import Vue from 'vue';
import Glide from '@glidejs/glide';
import template from './faqs-temp.pug';
import FAQsServices from '../../../core/services/FAQsServices';
import lazyloadImg from '../../../core/scripts/ultis/lazyloadImg';
import { route } from '../../../core/scripts/ultis/route';
import { arrowDisable } from '../../../core/scripts/ultis/slider';
import HttpCancelError from '../../../core/scripts/ultis/HttpCancelError';
import { isMobileViewport } from '../../../core/scripts/ultis/devices';
import Mark from '../../../core/scripts/ultis/mark';

export default class FAQs {
  constructor(selector) {
    this.vueInstance = this.createVueInstance(selector);
    this.bannerSearchForm = selector.querySelector('.js_faqs__banner-search-form');
    this.searchIcon = selector.querySelector('.js_faqs__banner-search-icon');
    this.searchInput = selector.querySelector('.js_faqs__banner-search-input');
    this.backButton = selector.querySelector('.js_faqs__banner-search-back-btn');
    this.initEvents();
  }

  initEvents = () => {
    const searchText = route.getParam('searchText');
    if (searchText && searchText.trim()) {
      this.showBackButton();
      this.searchInput.value = decodeURIComponent(searchText.trim());
    }
    this.bannerSearchForm.onsubmit = this.handleSubmit;
    this.searchIcon.onclick = this.handleSubmit;
    this.backButton.onclick = this.handleClickBackButton;
    window.addEventListener('popstate', () => {
      if (!route.getParam('searchText')) {
        this.hiddenBackButton();
      } else {
        this.showBackButton();
      }
    });
  };

  handleClickBackButton = (event) => {
    event.preventDefault();
    this.hiddenBackButton();
    this.searchInput.value = '';
    window.history.pushState({}, '', window.location.href.replace(route.getQueryString(), ''));
    this.vueInstance.fetchData();
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { value: searchText } = this.searchInput;
    if (!searchText.trim()) {
      return;
    }

    // add query param to url
    window.history.pushState({}, '', `?searchtext=${encodeURIComponent(searchText.trim())}`);
    this.showBackButton();
    this.vueInstance.searchText = searchText.trim();
    this.vueInstance.search();
  };

  showBackButton = () => {
    this.backButton.classList.add('show');
  };

  hiddenBackButton = () => {
    this.backButton.classList.remove('show');
  };

  createVueInstance = (selector) =>
    new Vue({
      template,
      el: '.js_faqs__content',
      data() {
        return {
          showSearchResult: false,
          searchResult: {
            currentPage: 1,
            hasMore: false,
            data: [],
            searchResultText: '',
            loading: false,
          },
          topics: [],
          selectedItem: {},
          showAll: false,
          searchText: '',
          showArrowBtn: false,
          enableShowAll: true,
          loading: false,
          loadingMore: false,
          slideItemWidth: {
            mobile: 120,
            desktop: 160,
          },
          slideBreakpoints: {
            default: {
              perView: 8,
            },
            1439: {
              perView: 6,
            },
            991: {
              perView: 5.5,
            },
            767: {
              perView: 4.5,
            },
            639: {
              perView: 2.5,
            },
          },
        };
      },

      mounted() {
        route.onChange(this.init);
        this.init();
        this.originWidth = document.body.offsetWidth;
        this.onResize();
      },

      methods: {
        init() {
          const searchText = route.getParam('searchText');

          if (searchText) {
            this.searchText = searchText;
            this.search();
          } else {
            this.fetchData();
          }
        },
        async fetchData() {
          this.showSearchResult = false;
          this.loading = true;
          const { topics, selected } = await FAQsServices.fetch();
          this.loading = false;
          this.topics = topics;
          this.selectedItem = this.topics.find((topic) => topic.name === selected);

          this.$nextTick(() => {
            lazyloadImg.DoObserver();
            this.createSlider();
          });
        },

        onResize() {
          window.addEventListener('resize', () => {
            if (this.debounceTimeout) {
              clearTimeout(this.debounceTimeout);
            }
            this.debounceTimeout = setTimeout(() => {
              if (this.originWidth !== document.body.offsetWidth) {
                this.originWidth = document.body.offsetWidth;
                if (this.slider) {
                  this.slider.destroy();
                  this.slider = null;
                }

                this.createSlider();
              }
            }, 100);
          });
        },

        createSlider() {
          if (!this.$refs.glide) {
            return;
          }
          const sliderWidth = this.$refs.glide.offsetWidth;
          const numberTopic = this.topics.length;
          const slideItemWidth = isMobileViewport() ? this.slideItemWidth.mobile : this.slideItemWidth.desktop;
          if (slideItemWidth * numberTopic <= sliderWidth) {
            this.destroySlider();
            return;
          }

          const { default: defaultBreakpoint, ...breakpoints } = this.slideBreakpoints;

          this.slider = new Glide(this.$refs.glide, {
            startAt: 0,
            rewind: false,
            bound: true,
            gap: 10,
            perView: defaultBreakpoint.perView,
            breakpoints,
          });
          this.showArrowBtn = true;
          this.enableShowAll = true;
          this.showAll = false;
          this.slider.mount({ arrowDisable });
        },

        getCurrentBreakPoint() {
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
        },

        destroySlider() {
          this.showArrowBtn = false;
          this.enableShowAll = false;
          this.showAll = true;
          if (this.slider) {
            this.slider.destroy();
            this.slider = null;
          }
        },

        toggerShowSlider() {
          this.showAll = !this.showAll;
          if (this.showAll) {
            try {
              this.slider.destroy();
              this.slider = null;
            } catch (err) {
              // err
            }
          } else {
            this.createSlider();
          }
        },

        handleSelectTopic(topic) {
          this.selectedItem = topic;
        },

        hightlightText() {
          const markIns = new Mark(this.$refs.searchResults);
          markIns.unmark();
          markIns.mark(this.searchText.trim(), { element: 'strong', accuracy: { value: 'exactly', limiters: '!@#&*()-–—+=[]{}|:;\'"‘’“”,.<>/?'.split('') } });
        },

        async handleLoadMore(topic) {
          this.loadingMore = true;
          try {
            const { currentPage, data, hasMore } = await FAQsServices.fetchByTopic(topic.name, topic.currentPage + 1);
            const cloneTopics = [...this.topics];
            const topicIndex = cloneTopics.findIndex((topicItem) => topicItem.name === topic.name);
            cloneTopics[topicIndex] = { ...topic, currentPage, hasMore, data: topic.data.concat(data) };
            this.topics = cloneTopics;
            this.selectedItem = { ...this.topics.find((topicItem) => topicItem.name === topic.name) };
          } catch (err) {
            // handle error
          }
          this.loadingMore = false;
        },

        async handleLoadMoreSearchResult() {
          const page = this.searchResult.currentPage + 1;
          const queryString = [`text=${encodeURIComponent(this.searchText.trim())}`, `page=${page}`];
          this.loadingMore = true;
          try {
            const response = await FAQsServices.search(queryString.join('&'));
            this.searchResult = {
              ...this.searchResult,
              ...response,
              data: this.searchResult.data.concat(response.data),
            };
            this.$nextTick(this.hightlightText);
          } catch (err) {
            // handle err
          }
          this.loadingMore = false;
        },

        async search() {
          this.showSearchResult = true;
          const queryString = [`text=${encodeURIComponent(this.searchText.trim())}`, 'page=1'];
          this.loading = true;
          try {
            const response = await FAQsServices.search(queryString.join('&'));
            this.searchResult = response;
            this.loading = false;
            this.$nextTick(this.hightlightText);
          } catch (err) {
            if (err instanceof HttpCancelError) {
              return;
            }

            this.loading = false;
          }
        },
      },

      computed: {
        content() {
          const topicData = this.topics.find((topic) => topic.name === this.selectedItem.name);
          return topicData ? topicData.data : [];
        },
      },
    });
}
