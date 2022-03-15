import Vue from 'vue';
import { findPnc } from '../RightNavigationFindPnc/FindPnc';
import checkCompatibilityForm from './check-product-compatibility-form.pug';
import { popup } from '../../../core/components/Popup/Popup';

class ProductDetailCompatibility {
  constructor(selector) {
    this.productCompatibility = selector.querySelector('.js_product-detail-comp__product-compatibility');
    this.partReplace = this.productCompatibility.dataset.partReplace;
    this.checkCompatibilityVueInstance = new Vue({
      el: '.js_check-product-compatibility-form',
      template: checkCompatibilityForm,
      data: () => ({
        partReplace: this.partReplace ? JSON.parse(this.partReplace) : null,
        pncOrModel: '',
        isValid: false,
        submited: false,
        collapse: null,
      }),
      methods: {
        handleSubmitForm(e) {
          e.preventDefault();
          if (!this.pncOrModel.trim()) {
            return;
          }
          this.submited = true;
          this.isValid = this.pncList.includes(this.pncOrModel.trim().toLowerCase()) || this.modelList.includes(this.pncOrModel.trim().toLowerCase());
          this.$nextTick(() => {
            popup(selector.querySelector('.js_product-detail-comp__product-compatibility-collapse'), false).updateHeight();
          });
        },

        handleClickFindPNC() {
          findPnc().show();
        },
      },

      computed: {
        pncList() {
          return this.partReplace?.pncs?.map((pnc) => pnc.trim().toLowerCase()) || [];
        },

        modelList() {
          return this.partReplace?.models?.map((model) => model.trim().toLowerCase()) || [];
        },
      },
    });
  }
}

export default ProductDetailCompatibility;
