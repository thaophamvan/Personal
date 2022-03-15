import PncPartListService from './PncListingService';
import ProductFiltering from '../../../core/components/ProductFiltering/ProductFiltering';
import ProductSorting from '../../../core/components/ProductSorting/ProductSorting';
import ProductList from '../ProductList/ProductList';
import HttpCancelError from '../../../core/scripts/ultis/HttpCancelError';

export default class PncListing {
  postcode = '';

  bodyRequest = {};

  getProductList() {
    return new ProductList(this.selector);
  }

  constructor(element) {
    this.selector = element;
    this.productFoundsSelector = this.selector.querySelector('.js_category__products-found');
    this.initDefaultData();
    this.initialComponent();
  }

  initDefaultData = () => {
    const { dataset } = this.selector;
    this.bodyRequest = {
      pncNumber: dataset.pncnumber,
      partType: dataset.parttype,
    };
  };

  fetchData = async () => {
    const queryString = [];
    Object.keys(this.bodyRequest).forEach((key) => {
      if (Array.isArray(this.bodyRequest[key]) && this.bodyRequest[key].length > 0) {
        this.bodyRequest[key].forEach((data) => {
          if (data.Value) {
            queryString.push(`${data.Key}=${encodeURIComponent(data.Value)}`);
          }
        });
      } else if (this.bodyRequest[key] && this.bodyRequest[key].length > 0) {
        queryString.push(`${key}=${encodeURIComponent(this.bodyRequest[key])}`);
      }
    });
    if (queryString.length > 0) {
      window.history.replaceState({}, '', `?${queryString.join('&')}`);
    } else {
      window.history.replaceState({}, '', `${window.location.href.split('?')[0]}`);
    }
    const mapSorting = {
      ...this.bodyRequest,
      Sorting: this.bodyRequest.Sorting && this.bodyRequest.Sorting[0],
    };

    this.productList.showLoading();
    try {
      const response = await PncPartListService.fetchData({ ...mapSorting, Page: this.page });
      this.productList.render(response.PartList);
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
