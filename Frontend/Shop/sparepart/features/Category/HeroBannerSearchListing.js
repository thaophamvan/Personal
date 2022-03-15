// import Selectbox from '../../../core/scripts/components/Selectbox';
import SearchServices from '../../../core/services/SearchServices';
import { findPnc } from '../RightNavigationFindPnc/FindPnc';
// import simpleNotify from '../../../core/scripts/ultis/simpleNotify';
class HeroBannerSearchListing {
  constructor(selector) {
    this.component = selector;
    this.listCategorySelector = this.component.querySelector('.js_hero-search__selectbox');
    this.pincOrModelInputSelector = this.component.querySelector('.js_pinc-or-model__input');
    this.searchForm = this.component.querySelector('.js_search-form');
    this.submitBtn = this.component.querySelector('.js_search-form-submit-btn');
    this.searchByCategoryForm = this.component.querySelector('.js_search-category-form');
    this.partTypeInput = this.component.querySelector('.js_part-type__input');
    this.findPncBtn = this.component.querySelector('.js_finc-pnc-btn');
    this.onKeyPressSearchForm();
    this.onSubmitSearchForm();
    this.onFindPncLinkClick();
  }

  onKeyPressSearchForm(e) {
    this.searchForm.addEventListener('keypress', (e) => {
      const key = e.keyCode || e.which;
      if (key === 13) {
        this.handleSubmitSearch();
      }
    });
  }

  onSubmitSearchForm() {
    this.submitBtn.onclick = () => {
      this.handleSubmitSearch();
    };
  }

  onFindPncLinkClick = () => {
    this.findPncBtn.addEventListener('click', (e) => {
      e.preventDefault();
      findPnc().show();
    });
  };

  handleSubmitSearch = () => {
    const pncOrModelText = this.pincOrModelInputSelector.value;
    const partType = this.partTypeInput.value;
    const params = [];
    if (pncOrModelText) {
      params.push(`modelPnc=${pncOrModelText}`);
    }
    if (partType) {
      params.push(`partNumber=${partType}`);
    }

    SearchServices.searchParts(params.join('&'))
      .then((res) => {
        window.location.href = res.Data;
      })
      .catch(() => { });
  };
}

export default HeroBannerSearchListing;
