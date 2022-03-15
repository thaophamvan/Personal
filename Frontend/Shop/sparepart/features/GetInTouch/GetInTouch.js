import { selectBox } from '../../../core/scripts/components/Selectbox';
class GetInTouch {
  constructor(selector) {
    this.component = selector;
    this.selectBtnSelector = this.component.querySelector('.js_selectbox__btn');
    this.listInquerySelector = this.component.querySelector('.js_get-in-touch__selectbox');
    selectBox(this.listInquerySelector);
  }
}

export default GetInTouch;
