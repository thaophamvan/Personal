import Vue from 'vue';
import template from './pagination-temp.pug';
import { getScrollbarWidth } from '../../scripts/ultis/getScrollBarWidth';

export default class Pagination {
  static options = {
    el: null,
    currentPage: 1,
    totalPage: 0,
    onChange: (pageNumber) => pageNumber,
    hintText: null,
    breakpoints: {
      992: {
        pageRange: 4,
      },
      default: {
        pageRange: 2,
      },
    },
  };

  constructor(options = Pagination.options) {
    this.options = {
      ...Pagination.options,
      ...options,
    };
    this.currentPage = parseInt(this.options.currentPage, 10);
    this.totalPage = parseInt(this.options.totalPage, 10);
    this.hintText = this.options.hintText;
    this.pageRange = this.options.breakpoints.default.pageRange;

    this.vueInstance = this.createVueInstance();
    this.vueInstance.currentPageProp = this.currentPage;
    this.vueInstance.$on('onChange', this.options.onChange);
  }

  createVueInstance = () =>
    new Vue({
      props: ['currentPageProp', 'totalPageProp'],
      el: this.options.el,
      template,
      data: () => ({
        currentPage: this.currentPageProp,
        totalPage: this.totalPage,
        pageList: [],
        hintText: this.hintText,
        pageRange: this.pageRange,
        breakpoints: this.options.breakpoints,
        originWidth: document.body.offsetWidth,
        isShow: true,
      }),
      created() {
        this.rerenderPageList();
        window.addEventListener('resize', this.handleResize);
      },
      destroyed() {
        window.removeEventListener('resize', this.handleResize);
      },
      methods: {
        handleResize() {
          if (this.timeout) {
            clearTimeout(this.timeout);
          }
          this.timeout = setTimeout(() => {
            if (this.originWidth !== document.body.offsetWidth) {
              this.originWidth = document.body.offsetWidth;
              this.rerenderPageList();
            }
          }, 100);
        },
        findPageIndex(pageNum) {
          return this.pageList && this.pageList.findIndex((page) => page === pageNum);
        },
        createPageList(isClickPage, isClickNextPage, isClickPrevPage) {
          const rangeStart = this.currentPage - 1;
          const rangeEnd = this.totalPage - this.currentPage;

          // avoid rerender
          if (this.pageList.length > 0) {
            const pageIndex = this.findPageIndex(this.currentPage);
            if (isClickPage) {
              // click to start page
              if (pageIndex === 0 && this.pageList[pageIndex + 1]) {
                return;
              }
              // click to end page
              if (pageIndex === this.pageList.length - 1 && this.pageList[pageIndex - 1]) {
                return;
              }
              // click to a page
              if (pageIndex > 0 && pageIndex < this.pageList.length - 1) {
                return;
              }
            }
            if (isClickNextPage && pageIndex > 0) {
              return;
            }
            if (isClickPrevPage && pageIndex >= 0) {
              return;
            }
          }

          let pageList = [];
          if (rangeStart > this.pageRange) {
            pageList = pageList.concat([1, 0]);
          } else {
            for (let page = 1; page <= this.pageRange; page++) {
              if (pageList.findIndex((pageNum) => pageNum === page) < 0) {
                pageList.push(page);
              }
            }
          }

          // add middle page list
          if (isClickNextPage) {
            for (let page = this.currentPage; page < this.currentPage + this.pageRange; page++) {
              if (page <= this.totalPage - this.pageRange) {
                pageList.push(page);
              }
            }
          }

          if (isClickPrevPage) {
            for (let page = this.currentPage - this.pageRange + 1; page <= this.currentPage; page++) {
              if (page > this.pageRange) {
                pageList.push(page);
              }
            }
          }

          // add end page list
          if (rangeEnd > this.pageRange) {
            pageList = pageList.concat([0, this.totalPage]);
          } else {
            for (let page = this.totalPage - this.pageRange + 1; page <= this.totalPage; page++) {
              if (pageList.findIndex((pageNum) => pageNum === page) < 0) {
                pageList.push(page);
              }
            }
          }

          const threeDotsIndexes = pageList.map((pageNumber, index) => pageNumber === 0 && index).filter((pageNumber) => !!pageNumber);

          threeDotsIndexes.forEach((threeDotsIndex) => {
            if (pageList[threeDotsIndex + 1] - pageList[threeDotsIndex - 1] === this.pageRange) {
              const tempPageList = [];

              if (threeDotsIndex === 1) {
                for (let page = 2; page < pageList[threeDotsIndex + 1]; page++) {
                  tempPageList.push(page);
                }
              } else {
                for (let page = pageList[threeDotsIndex - 1] + 1; page < this.totalPage; page++) {
                  tempPageList.push(page);
                }
              }

              pageList.splice(threeDotsIndex, 1, ...tempPageList);
            }
          });

          this.pageList = [...pageList];
        },
        rerenderPageList() {
          this.pageRange = this.breakpoints.default.pageRange;

          if (document.body.clientWidth + getScrollbarWidth() >= 992 && this.totalPage > this.breakpoints[992].pageRange) {
            this.pageRange = this.breakpoints[992].pageRange;
          } else if (this.totalPage < this.breakpoints.default.pageRange) {
            this.pageRange = this.totalPage;
          }

          this.pageList = [];
          this.createPageList();
        },
        handleClickPageBtn(page) {
          if (!page) {
            return;
          }
          this.currentPage = page;
          this.createPageList(true, false, false);
          this.onChangePage();
        },
        handleClickNextPage() {
          if (this.currentPage === this.totalPage) {
            return;
          }

          this.currentPage += 1;
          this.createPageList(false, true, false);
          this.onChangePage();
        },

        handleClickPrevPage() {
          if (this.currentPage === 1) {
            return;
          }

          this.currentPage -= 1;
          this.createPageList(false, false, true);
          this.onChangePage();
        },

        onChangePage() {
          this.$emit('onChange', this.currentPage);
        },

        hide() {
          this.isShow = false;
        },

        show() {
          this.isShow = true;
        },
      },
      watch: {
        totalPageProp(newData) {
          this.totalPage = newData;
          this.rerenderPageList();
        },
        currentPageProp(newData) {
          if (newData !== this.currentPage) {
            this.currentPage = newData;
            this.rerenderPageList();
          }
        },
      },
    });

  setHintText = (text) => {
    this.vueInstance.hintText = text;
  };

  setTotalPage = (totalPage) => {
    this.vueInstance.totalPageProp = totalPage;
  };

  setCurrentPage = (currentPage) => {
    this.vueInstance.currentPageProp = currentPage;
  };

  hide = () => {
    this.vueInstance.hide();
  };

  show = () => {
    this.vueInstance.show();
  };
}

export const pagination = (options = Pagination.options) => new Pagination(options);
