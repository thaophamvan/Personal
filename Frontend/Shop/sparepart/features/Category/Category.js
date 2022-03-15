import CategoryServices from './CategoryServices';
import ProductFiltering from '../../../core/components/ProductFiltering/ProductFiltering';
import ProductSorting from '../../../core/components/ProductSorting/ProductSorting';
import ProductList from '../ProductList/ProductList';
import HttpCancelError from '../../../core/scripts/ultis/HttpCancelError';

export default class Category {
  postcode = '';

  bodyRequest = {};

  getProductList() {
    return new ProductList(this.selector);
  }

  constructor(element) {
    this.selector = element;
    this.productFoundsSelector = this.selector.querySelector('.js_category__products-found');
    this.initialComponent();
    this.initDefaultSearch();
  }

  initDefaultSearch = () => {
    const { dataset } = this.selector;
    this.defaultSearchModelCategory = dataset.modelCategory;
  };

  fetchData = async () => {
    const queryString = [];
    Object.keys(this.bodyRequest).forEach((key) => {
      this.bodyRequest[key].forEach((data) => {
        queryString.push(`${data.Key}=${encodeURIComponent(data.Value)}`);
      });
    });
    if (queryString.length > 0) {
      window.history.replaceState({}, '', `?${queryString.join('&')}`);
    } else {
      window.history.replaceState({}, '', `${window.location.href.split('?')[0]}`);
    }
    const mapSorting = {
      ...this.bodyRequest,
      Sorting: this.bodyRequest.Sorting && this.bodyRequest.Sorting[0],
      modelCategory: this.defaultSearchModelCategory,
    };

    this.productList.showLoading();
    try {
      const response = await CategoryServices.fetchData({ ...mapSorting, Page: this.page });
      this.productList.render(response.PartList, response.signInUrl, response.isUnAuthenticated);
      this.productList.renderPagination(response.Pagination);
      const { ProductFilters } = response.FilterAndSorting;
      ProductFilters.forEach((filterData) => {
        this.productFiltering.updateFilter(filterData);
      });
      this.productFoundsSelector.textContent = response.Pagination.ProductFoundMessage;
      this.productList.hideLoading();
    } catch (err) {
      if (err instanceof HttpCancelError) {
        return;
      }
      this.productList.hideLoading();
    }
  };

  initialComponent = () => {
    this.productFiltering = new ProductFiltering(this.selector);
    this.productSorting = new ProductSorting(this.selector);
    this.productList = this.getProductList();
    this.productFiltering.onSubmit = this.handleSubmitFilter;
    this.productSorting.onSubmit = this.handleSort;
    this.handleInitialSort(this.productSorting.getInitialSort());
    this.handleInitialFilter(this.productFiltering.getInitialFilter());
    this.productList.submitChangePage = this.handleChangePage;
  };

  handleInitialFilter = (appliedFilters) => {
    const filtersData = [];
    appliedFilters.forEach((filter) => {
      const existingData = filtersData.find((filterData) => filterData.Key === filter.key);
      if (existingData) {
        const existingIndex = filtersData.indexOf(existingData);
        filtersData[existingIndex].Value = filtersData[existingIndex].Value.concat(`|${filter.text}`);
      } else {
        filtersData.push({
          Key: filter.key,
          Value: filter.text,
        });
      }
    });
    this.bodyRequest = {
      ...this.bodyRequest,
      Filters: filtersData,
    };
  };

  handleInitialSort = (sortValue) => {
    if (sortValue) {
      this.bodyRequest = {
        ...this.bodyRequest,
        Sorting: [
          {
            Key: 'sortby',
            Value: sortValue,
          },
        ],
      };
    }
  };

  handleSort = (value) => {
    this.bodyRequest = {
      ...this.bodyRequest,
      Sorting: [
        {
          Key: 'sortby',
          Value: value,
        },
      ],
    };
    this.page = 1;
    this.fetchData();
  };

  handleSubmitFilter = (appliedFilters) => {
    const filtersData = [];
    appliedFilters.forEach((filter) => {
      const existingData = filtersData.find((filterData) => filterData.Key === filter.key);
      if (existingData) {
        const existingIndex = filtersData.indexOf(existingData);
        filtersData[existingIndex].Value = filtersData[existingIndex].Value.concat(`|${filter.text}`);
      } else {
        filtersData.push({
          Key: filter.key,
          Value: filter.text,
        });
      }
    });
    this.bodyRequest = {
      ...this.bodyRequest,
      Filters: filtersData,
    };
    this.page = 1;
    this.fetchData();
  };

  handleChangePage = (page) => {
    this.page = page;
    this.fetchData();
  };
}
