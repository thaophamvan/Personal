import SearchServices from '../../../core/services/SearchServices';
import { findPnc } from '../RightNavigationFindPnc/FindPnc';

export default class SearchSparePartBanner {
  pncOrModel = '';

  partType = '';

  constructor(selector) {
    this.searchForm = selector.querySelector('.js_search-form');
    this.submitBtn = selector.querySelector('.js_search-form-submit-btn');
    this.findPncBtn = selector.querySelector('.js_finc-pnc-btn');
    this.pincOrModelInputMd = selector.querySelector('.js_pinc-or-model__input--md');
    this.pincOrModelInputSm = selector.querySelector('.js_pinc-or-model__input--sm');
    this.partTypeInputMd = selector.querySelector('.js_part-type__input--md');
    this.partTypeInputSm = selector.querySelector('.js_part-type__input--sm');
    this.pncOrModel = this.pincOrModelInputMd.value.trim() || this.pincOrModelInputSm.value.trim();
    this.partType = this.partTypeInputMd.value.trim() || this.partTypeInputSm.value.trim();

    this.onKeyPressSearchForm();
    this.onSubmitSearchForm();
    this.onFindPncLinkClick();
    this.intiEventForInputPnc();
  }

  onKeyPressSearchForm() {
    this.searchForm.addEventListener('keypress', (e) => {
      const key = e.keyCode || e.which;
      if (key === 13) this.handleSubmitSearch();
    });
  }

  onSubmitSearchForm() {
    this.submitBtn.onclick = () => {
      this.handleSubmitSearch();
    };
  }

  intiEventForInputPnc = () => {
    this.pincOrModelInputMd.addEventListener('input', (e) => {
      this.handleChangeInput(e, 'pncOrModel', [this.pincOrModelInputMd, this.pincOrModelInputSm]);
      this.toggleInvalidClassForInputPnc();
    });
    this.pincOrModelInputSm.addEventListener('input', (e) => {
      this.handleChangeInput(e, 'pncOrModel', [this.pincOrModelInputMd, this.pincOrModelInputSm]);
      this.toggleInvalidClassForInputPnc();
    });
    this.partTypeInputMd.addEventListener('input', (e) => {
      this.handleChangeInput(e, 'partType', [this.partTypeInputMd, this.partTypeInputSm]);
    });
    this.partTypeInputSm.addEventListener('input', (e) => {
      this.handleChangeInput(e, 'partType', [this.partTypeInputMd, this.partTypeInputSm]);
    });
  };

  handleChangeInput = (e, model, inputs = []) => {
    const { value } = e.target;
    this[model] = value;
    inputs.forEach((input) => {
      input.value = value;
    });
  };

  toggleInvalidClassForInputPnc = () => {
    if (!this.pncOrModel.trim()) {
      this.pincOrModelInputMd.classList.add('error');
      this.pincOrModelInputSm.classList.add('error');
    } else {
      this.pincOrModelInputMd.classList.remove('error');
      this.pincOrModelInputSm.classList.remove('error');
    }
  };

  onFindPncLinkClick = () => {
    this.findPncBtn.addEventListener('click', (e) => {
      e.preventDefault();
      findPnc().show();
    });
  };

  handleSubmitSearch = () => {
    this.toggleInvalidClassForInputPnc();
    if (!this.pncOrModel.trim()) {
      return;
    }

    const params = [`modelPnc=${this.pncOrModel}`];
    if (this.partType.trim()) {
      params.push(`partNumber=${this.partType.trim()}`);
    }

    SearchServices.searchParts(params.join('&'))
      .then((res) => {
        window.location.href = res.Data;
      })
      .catch(() => {});
  };
}
