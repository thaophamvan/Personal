import Vue from 'vue';
import template from './search-results-temp.pug';
import SearchServices from '../../../core/services/SearchServices';
import HttpCancelError from '../../../core/scripts/ultis/HttpCancelError';
import Mark from '../../../core/scripts/ultis/mark';

export default (el) =>
  new Vue({
    el,
    template,
    data() {
      return {
        input: null,
        items: [],
        hasNextPage: false,
        show: false,
        page: 1,
        totalItem: 0,
        loadingMore: false,
      };
    },
    methods: {
      hightlightText() {
        const markInstance = new Mark(this.$refs.searchResults);
        markInstance.unmark();
        markInstance.mark(this.input.value.trim(), { element: 'strong' });
      },
      handleScroll({ target }) {
        if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 10 && this.hasNextPage) {
          this.loadMore();
        }
      },
      async fetchData() {
        this.page = 1;

        if (this.fetchDataTimeout) {
          clearTimeout(this.fetchDataTimeout);
        }
        this.$emit('loadingData');
        this.fetchDataTimeout = setTimeout(async () => {
          try {
            const { items, totalMatching } = await SearchServices.fetchSuggestions(this.input.value.trim(), this.page);
            if (this.input.value.trim().length < 3) {
              this.items = [];
              return;
            }
            this.items = items;
            this.hasNextPage = totalMatching > this.items.length;
            this.show = true;
            this.totalItem = totalMatching;
            this.$emit('loadedData');
            this.$nextTick(() => {
              this.fillFullData();
              this.$refs.searchResults.scrollTop = 0;
              this.hightlightText();
            });
          } catch (err) {
            if (err instanceof HttpCancelError) {
              return;
            }
            this.$emit('loadedData');
          }
        }, 100);
      },

      async loadMore() {
        if (this.loadingMore) {
          return;
        }
        if (this.hasNextPage) {
          this.loadingMore = true;
          this.page += 1;
          try {
            const { items } = await SearchServices.fetchSuggestions(this.input.value.trim(), this.page);
            this.items = this.items.concat(items);
            this.hasNextPage = this.totalItem > this.items.length;
            this.$nextTick(() => {
              this.fillFullData();
              this.hightlightText();
            });
          } catch (err) {
            console.log(err);
          }
          this.loadingMore = false;
        }
      },

      fillFullData() {
        const maxHeight = +window
          .getComputedStyle(this.$refs.searchResults)
          .getPropertyValue('max-height')
          .replace('px', '');
        const { offsetHeight } = this.$refs.searchResults;
        if (maxHeight > offsetHeight) {
          this.loadMore();
        }
      },
    },
  });
