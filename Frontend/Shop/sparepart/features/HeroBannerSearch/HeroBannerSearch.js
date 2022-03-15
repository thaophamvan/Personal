import JsTabs from '../../../core/components/JsTabs/JsTabs';
import Selectbox from '../../../core/scripts/components/Selectbox';
import SearchServices from '../../../core/services/SearchServices';
import { findPnc } from '../RightNavigationFindPnc/FindPnc';

class HeroBannerSearch {
  constructor(selector) {
    this.component = selector;
    this.listCategorySelector = this.component.querySelector('.js_hero-search__selectbox');
    this.pincOrModelInputSelector = this.component.querySelector('.js_pinc-or-model__input');
    this.searchForm = this.component.querySelector('.js_search-form');
    this.submitBtn = this.component.querySelector('.js_search-form-submit-btn');
    this.searchByCategoryForm = this.component.querySelector('.js_search-category-form');
    this.partTypeInput = this.component.querySelector('.js_part-type__input');
    this.findPncBtn = this.component.querySelector('.js_finc-pnc-btn');
    this.selectBtnSelector = this.component.querySelector('.js_selectbox__btn');
    this.initTab();
    this.createSelectBox();
    this.onFindPncLinkClick();

    this.searchByCategoryForm.addEventListener('click', this.handleSubmitSearchByCategory);
    this.pincOrModelInputSelector.addEventListener('input', (e) => {
      this.handleChangeValue(e.target.value);
    });
    this.onKeyPressSearchForm();
    this.onSubmitSearchForm();
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

  initTab = () => {
    const jsTabs = new JsTabs({
      elm: '.hero-banner__search',
      shouldScrollTabIntoView: false,
      onClickHandlerComplete: this.onClickAccessories,
    });
    jsTabs.init();
  };

  onClickAccessories = (tab) => {
    const { dataset } = tab;
    const newUrl = window.location.origin + dataset.url;
    window.location.href = newUrl;
  }

  createSelectBox = () => {
    this.selectbox = new Selectbox(this.listCategorySelector, { onChange: this.handleSelectCategoryAccessory });
  };

  handleSelectCategoryAccessory = (key) => {
    this.categoryAccessory = key;
    this.selectbox.removeError();
    const frmGrp = this.selectBtnSelector.closest('.form-group');
    if (this.categoryAccessory) {
      frmGrp.classList.remove('error');
    } else {
      frmGrp.classList.add('error');
    }
  };

  onFindPncLinkClick = () => {
    this.findPncBtn.addEventListener('click', (e) => {
      e.preventDefault();
      findPnc().show();
    });
  };

  handleSubmitSearch = () => {
    const pncOrModelText = this.pincOrModelInputSelector.value;
    const partType = this.partTypeInput.value;
    if (!pncOrModelText.trim()) {
      const frmGrp = this.pincOrModelInputSelector.closest('.form-group');
      frmGrp.classList.add('error');
      return;
    }

    const params = [];
    if (pncOrModelText) {
      params.push(`modelPnc=${pncOrModelText.trim()}`);
    }
    if (partType) {
      params.push(`partNumber=${partType.trim()}`);
    }

    SearchServices.searchParts(params.join('&'))
      .then((res) => {
        window.location.href = res.Data;
      })
      .catch(() => { });
  };

  handleSubmitSearchByCategory = () => {
    if (this.categoryAccessory) {
      window.location.href = `${this.categoryAccessory}`;
    } else {
      this.selectbox.addError();
    }
  };

  handleChangeValue = (val) => {
    const frmGrp = this.pincOrModelInputSelector.closest('.form-group');
    if (val) {
      frmGrp.classList.remove('error');
    } else {
      frmGrp.classList.add('error');
    }
  };
}

export default HeroBannerSearch;
