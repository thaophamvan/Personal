import Vue from 'vue';
import PromotionalBannerServices from './PromotionalBannerServices';
import template from './promotional-banner-result.pug';
import simpleNotify from '../../scripts/ultis/simpleNotify';

export default class PromotionalBanner {
  constructor(selector) {
    this.selector = selector;
    this.applyCode = selector.querySelector('.js_promotion-banner__apply-code');
    this.applyCodeBtn = this.applyCode.querySelector('.js_promotion-banner__apply-code-btn');

    this.applyCodeBtn.addEventListener('click', this.applyPromotionCode);
  }

  createVueInstance = (respone) =>
    new Vue({
      template,
      el: this.applyCode,
      data() {
        return {
          respone,
        };
      },
    });

  applyPromotionCode = async () => {
    const { code } = this.selector.dataset;
    const response = await PromotionalBannerServices.applyPromotionCode({ code }).catch((data) => {
      simpleNotify.notify({
        message: data.message,
        level: 'danger',
      });
    });
    console.log(response);
    if (response) {
      this.vueInstance = this.createVueInstance(response);
    }
  };
}
