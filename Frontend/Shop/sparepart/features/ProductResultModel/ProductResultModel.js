import { findPnc } from '../RightNavigationFindPnc/FindPnc';
export default class ProductResultModel {
  constructor(selector) {
    this.component = selector;
    this.findPncBtn = this.component.querySelector('.js_finc-pnc-btn');
    this.init();
  }

  init = () => {
    this.findPncBtn.addEventListener('click', (e) => {
      e.preventDefault();
      findPnc().show();
    });
  };
}
