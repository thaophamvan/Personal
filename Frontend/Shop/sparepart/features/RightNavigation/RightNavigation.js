import Vue from 'vue';
import template from './right-navigation-temp.pug';
import { getScrollbarWidth } from '../../../core/scripts/ultis/getScrollBarWidth';

const instances = {};
export default class RightNavigation {
  constructor(navName) {
    if (instances[navName]) {
      return instances[navName];
    }

    this.el = document.createElement('div');
    document.body.appendChild(this.el);
    this.vueInstance = new Vue({
      el: this.el,
      template,
      data() {
        return {
          isShow: false,
          bodyContent: '',
        };
      },
      methods: {
        show() {
          this.isShow = true;
          document.body.style.overflow = 'hidden';
          document.body.style.paddingRight = `${getScrollbarWidth()}px`;
        },
        hide() {
          this.isShow = false;
          document.body.style.overflow = 'auto';
          document.body.style.removeProperty('padding-right');
        },
      },
    });

    instances[navName] = this;
  }

  show = () => {
    setTimeout(() => {
      this.vueInstance.show();
    }, 0);
  };

  getContentEl = () => this.vueInstance.$refs.content;
}
