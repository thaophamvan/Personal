import Vue from 'vue';
import Selectbox from '../../../core/scripts/components/Selectbox';
import FindPncServices from './FindPncServices';
import { popup } from '../../../core/components/Popup/Popup';
import RightNavigation from '../RightNavigation/RightNavigation';
import template from './find-pnc-temp.pug';

let instance;
class FindPnc {
  constructor() {
    if (instance) {
      return instance;
    }
    this.rightNavigation = new RightNavigation('how-to-find-pnc');
    this.fetchContent();
    instance = this;
  }

  createVueInstance = (data) =>
    new Vue({
      template,
      el: this.rightNavigation.getContentEl(),
      data: () => ({
        ...data,
        categoryData: null,
      }),
    });

  fetchContent = async () => {
    const response = await FindPncServices.getContent();
    this.findPncVueInstance = this.createVueInstance(response);
    popup(this.findPncVueInstance.$refs.categorySelectBox);
    this.categoryListSelectbox = new Selectbox(this.findPncVueInstance.$refs.categorySelectBox);
    this.categoryListSelectbox.onSubmit = this.fetchContentCategory;
  };

  fetchContentCategory = async (key) => {
    const response = await FindPncServices.getContentByCategory(key);
    this.findPncVueInstance.categoryData = response;
  };

  show = () => {
    this.rightNavigation.show();
  };
}

export default FindPnc;

export const findPnc = () => new FindPnc();
