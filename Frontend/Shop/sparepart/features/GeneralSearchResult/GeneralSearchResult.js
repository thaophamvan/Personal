import GeneralSearchResultServices from './GeneralSearchResultServices';
import ProductFiltering from '../../../core/components/ProductFiltering/ProductFiltering';
import ProductSorting from '../../../core/components/ProductSorting/ProductSorting';
import ProductList from '../ProductList/ProductList';
import { findPnc } from '../RightNavigationFindPnc/FindPnc';
import SearchServices from '../../../core/services/SearchServices';
import HttpCancelError from '../../../core/scripts/ultis/HttpCancelError';

export default class GeneralSearchResult {
  bodyRequest = {};

  getProductList() {
    return new ProductList(this.selector);
  }

  constructor(element) {
    this.selector = element;
    this.productListSelector = document.querySelector('.product-list');
    this.productFoundsSelector = this.selector.querySelector('.js_general-search-result__products-found');
    this.initialBodyRequest();
    if (this.productListSelector) {
      this.initialComponent();
    }

    this.findPncBtns = this.selector.querySelectorAll('.js_find-pnc-btn');
    this.onFindPncLinkClick();

    this.searchPartsForm = this.selector.querySelector('.js_search-form');
    this.onSearchForm();
  }

  onSearchForm() {
    if (this.searchPartsForm) {
      this.pncOrModelNumberInput = this.searchPartsForm.querySelector('.js_pnc-or-model-number__input');
      this.partInfo = this.searchPartsForm.querySelector('.js_part-input');

      this.searchPartsForm.addEventListener('keypress', (e) => {
        const key = e.keyCode || e.which;
        if (key === 13) this.handleSubmitSearch();
      });
      this.submitBtn = this.selector.querySelector('.js_search-form-submit-btn');
      if (this.submitBtn) {
        this.submitBtn.onclick = () => {
          this.handleSubmitSearch();
        };
      }
    }
  }

  fetchData = async () => {
    const queryString = [];
    Object.keys(this.bodyRequest).forEach((key) => {
      if (Array.isArray(this.bodyRequest[key])) {
        this.bodyRequest[key].forEach((data) => {
          queryString.push(`${data.Key}=${data.Value}`);
        });
      } else if (this.bodyRequest[key] && this.bodyRequest[key].length > 0) {
        queryString.push(`${key}=${this.bodyRequest[key]}`);
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
      const response = await GeneralSearchResultServices.fetchData({ ...mapSorting, Page: this.page });
      this.productList.render(response.PartList, response.signInUrl);
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

  initialBodyRequest = () => {
    const keywordElemnt = this.selector.querySelector('.js_keyword');
    this.bodyRequest = { searchText: keywordElemnt?.textContent };
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

  onFindPncLinkClick = () => {
    [...this.findPncBtns].forEach((findPncBtn) =>
      findPncBtn.addEventListener('click', (e) => {
        e.preventDefault();
        findPnc().show();
      }),
    );
  };

  handleSubmitSearch = () => {
    const pncOrModelNumber = this.pncOrModelNumberInput.value;
    const partInfo = this.partInfo.value;
    const params = [];
    if (pncOrModelNumber) {
      params.push(`modelPnc=${pncOrModelNumber}`);
    }
    if (partInfo) {
      params.push(`partNumber=${partInfo}`);
    }

    if (pncOrModelNumber) {
      SearchServices.searchParts(params.join('&'))
        .then((res) => {
          window.location.href = res.Data;
        })
        .catch(() => { });
    }
  };
}
