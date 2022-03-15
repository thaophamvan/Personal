import Selectbox from '../../scripts/components/Selectbox';

export default class ProductSorting {
  optionsRef = {};

  onSubmit = () => {};

  constructor(element) {
    this.selector = element;
    this.sortSelectboxSelector = this.selector.querySelector('.js_product-sorting__sort-selectbox');
    const selectbox = new Selectbox(this.sortSelectboxSelector);
    selectbox.onSubmit = this.handleSubmitSort;
  }

  getInitialSort = () => this.sortSelectboxSelector.dataset.sort;

  handleSubmitSort = (value) => {
    this.onSubmit(value);
  };
}
